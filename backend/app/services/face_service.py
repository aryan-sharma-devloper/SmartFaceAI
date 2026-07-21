import os
import uuid

import cv2
import numpy as np
from sqlalchemy.orm import Session

from app.models.face_embedding import FaceEmbedding
from app.models.user import User

from app.utils.face_engine import face_engine
from app.utils.similarity import cosine_similarity
from app.utils.liveness import eye_aspect_ratio
from app.services.attendance_service import mark_attendance

UPLOAD_DIR = "images/users"

# ----------------------------------------
# Blink Detection State
# ----------------------------------------
blink_counter = 0
blink_detected = False


# =====================================================
# FACE ENROLLMENT
# =====================================================
def enroll_face(
    db: Session,
    user_id: int,
    pose: str,
    image_bytes: bytes,
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        return None

    np_image = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(
        np_image,
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise Exception("Invalid image.")

    faces = face_engine.get_faces(image)

    if len(faces) == 0:
        raise Exception("No face detected")

    face = faces[0]

    embedding = face.embedding.tolist()

    user_folder = os.path.join(
        UPLOAD_DIR,
        str(user_id),
    )

    os.makedirs(
        user_folder,
        exist_ok=True,
    )

    filename = f"{pose}_{uuid.uuid4()}.jpg"

    image_path = os.path.join(
        user_folder,
        filename,
    )

    cv2.imwrite(
        image_path,
        image,
    )

    existing = (
        db.query(FaceEmbedding)
        .filter(
            FaceEmbedding.user_id == user_id,
            FaceEmbedding.pose == pose,
        )
        .first()
    )

    if existing:

        existing.embedding = embedding
        existing.image_path = image_path
        existing.quality_score = 99.0
        existing.model_name = "ArcFace"

        db.commit()
        db.refresh(existing)

        return existing

    new_face = FaceEmbedding(
        user_id=user_id,
        embedding=embedding,
        image_path=image_path,
        pose=pose,
        quality_score=99.0,
        model_name="ArcFace",
    )

    db.add(new_face)

    db.commit()

    db.refresh(new_face)

    return new_face
# =====================================================
# FACE VERIFICATION
# =====================================================
def verify_face(
    db: Session,
    image_bytes: bytes,
):

    global blink_counter
    global blink_detected

    np_image = np.frombuffer(
        image_bytes,
        np.uint8,
    )

    image = cv2.imdecode(
        np_image,
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise Exception("Image decode failed")

    faces = face_engine.get_faces(image)

    if len(faces) == 0:
        raise Exception("No face detected")

    stored_faces = db.query(
        FaceEmbedding
    ).all()

    if len(stored_faces) == 0:

        return {
            "total_faces": 0,
            "verified_faces": 0,
            "faces": [],
        }

    THRESHOLD = 0.60

    detected_faces = []

    # ----------------------------------------
    # Check every detected face
    # ----------------------------------------
    for face in faces:

        live_embedding = face.embedding

        bbox = face.bbox

        face_box = {
            "x": int(bbox[0]),
            "y": int(bbox[1]),
            "width": int(bbox[2] - bbox[0]),
            "height": int(bbox[3] - bbox[1]),
        }

        # ----------------------------------------
        # Liveness
        # ----------------------------------------
        # try:

        #     landmarks = face.landmark_2d_106

        #     left_eye = landmarks[33:39]

        #     right_eye = landmarks[87:93]

        #     left_ear = eye_aspect_ratio(
        #         left_eye
        #     )

        #     right_ear = eye_aspect_ratio(
        #         right_eye
        #     )

        #     ear = (
        #         left_ear + right_ear
        #     ) / 2

        #     print(f"EAR : {ear:.3f}")

        #     BLINK_THRESHOLD = 0.18

        #     if ear < BLINK_THRESHOLD:

        #         blink_counter += 1

        #     else:

        #         if blink_counter >= 2:
        #             blink_detected = True

        #         blink_counter = 0

        # except Exception:

        #     blink_detected = True

        # if not blink_detected:

        #     detected_faces.append(
        #         {
        #             "verified": False,
        #             "confidence": 0,
        #             "matched_pose": None,
        #             "message": "Please Blink",
        #             "face_box": face_box,
        #             "user": None,
        #         }
        #     )

        #     continue

        best_score = -1

        best_face = None

        for stored_face in stored_faces:

            score = cosine_similarity(
                live_embedding,
                stored_face.embedding,
            )

            if score > best_score:

                best_score = score

                best_face = stored_face
                        # ----------------------------------------
        # Unknown Person
        # ----------------------------------------
        if best_score < THRESHOLD:

            detected_faces.append(
                {
                    "verified": False,
                    "confidence": round(best_score * 100, 2),
                    "matched_pose": None,
                    "message": "Unknown Person",
                    "face_box": face_box,
                    "user": None,
                }
            )

            continue

        # ----------------------------------------
        # Get matched user
        # ----------------------------------------
        user = (
            db.query(User)
            .filter(User.id == best_face.user_id)
            .first()
        )
        mark_attendance(
            db=db,
            user_id=user.id,
            camera_name="Main Camera",
)

        # Reset blink for next verification
        blink_detected = False

        detected_faces.append(
            {
                "verified": True,
                "confidence": round(best_score * 100, 2),
                "matched_pose": best_face.pose,
                "message": "Verified",
                "face_box": face_box,
                "user": {
                    "id": user.id,
                    "employee_id": user.employee_id,
                    "full_name": user.full_name,
                    "department": user.department,
                    "email": user.email,
                    "phone": user.phone,
                },
            }
        )

    # ----------------------------------------
    # Final Summary
    # ----------------------------------------
    verified_count = sum(
        1 for face in detected_faces
        if face["verified"]
    )

    return {
        "total_faces": len(detected_faces),
        "verified_faces": verified_count,
        "faces": detected_faces,
    }