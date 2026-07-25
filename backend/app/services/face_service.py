import os
import uuid

import cv2
import numpy as np
from sqlalchemy.orm import Session

from app.models.face_embedding import FaceEmbedding
from app.models.user import User
from app.models.verification_log import VerificationLog

from app.services.attendance_service import mark_attendance

from app.utils.face_engine import face_engine
from app.utils.similarity import cosine_similarity
from app.utils.liveness import eye_aspect_ratio


UPLOAD_DIR = "images/users"

# ----------------------------------------
# Blink Detection
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

        # (Blink Detection code can stay commented if you want)

        best_score = -1
        best_face = None

               # ----------------------------------------
        # Compare with all stored embeddings
        # ----------------------------------------
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

            verification = VerificationLog(
                user_id=None,
                confidence_score=round(best_score * 100, 2),
                status="failed",
                camera_name="Main Camera",
                response_time_ms=0,
            )

            db.add(verification)
            db.commit()

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
        # Fetch matched user
        # ----------------------------------------
        user = (
            db.query(User)
            .filter(User.id == best_face.user_id)
            .first()
        )

        if user is None:
            continue
        
                # ----------------------------------------
        # Mark Attendance
        # ----------------------------------------
        mark_attendance(
            db=db,
            user_id=user.id,
            camera_name="Main Camera",
        )

        # ----------------------------------------
        # Save Verification Log
        # ----------------------------------------
        verification = VerificationLog(
            user_id=user.id,
            confidence_score=round(best_score * 100, 2),
            status="verified",
            camera_name="Main Camera",
            response_time_ms=0,
        )

        db.add(verification)
        db.commit()

        # Reset blink status
        blink_detected = False

        # ----------------------------------------
        # Add Verified Face Result
        # ----------------------------------------
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
                    "profile_photo": user.profile_photo,
                },
            }
        )
            # ----------------------------------------
    # Return Final Response
    # ----------------------------------------
    verified_count = sum(
        1
        for item in detected_faces
        if item["verified"]
    )

    return {
        "total_faces": len(faces),
        "verified_faces": verified_count,
        "faces": detected_faces,
    }