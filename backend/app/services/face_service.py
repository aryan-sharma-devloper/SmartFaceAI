import os
import uuid

import cv2
import numpy as np
from sqlalchemy.orm import Session

from app.models.face_embedding import FaceEmbedding
from app.models.user import User
from app.utils.face_engine import face_engine
from app.utils.similarity import cosine_similarity

UPLOAD_DIR = "images/users"


# =====================================================
# FACE ENROLLMENT
# =====================================================
def enroll_face(db: Session, user_id: int, image_bytes: bytes):

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        return None

    np_image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    faces = face_engine.get_faces(image)

    if len(faces) == 0:
        raise Exception("No face detected")

    face = faces[0]

    embedding = face.embedding.tolist()

    user_folder = os.path.join(UPLOAD_DIR, str(user_id))
    os.makedirs(user_folder, exist_ok=True)

    filename = f"{uuid.uuid4()}.jpg"

    image_path = os.path.join(user_folder, filename)

    cv2.imwrite(image_path, image)

    new_face = FaceEmbedding(
        user_id=user_id,
        embedding=embedding,
        image_path=image_path,
        pose="front",
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
def verify_face(db: Session, image_bytes: bytes):

    print("\n" + "=" * 60)
    print("VERIFY REQUEST RECEIVED")
    print("=" * 60)

    print("Image Bytes:", len(image_bytes))

    np_image = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    print("Decoded Image:", image is not None)

    if image is None:
        raise Exception("Image decode failed")

    print("Image Shape:", image.shape)

    # Save received image for debugging
    cv2.imwrite("test_verify.jpg", image)
    print("Saved image as test_verify.jpg")

    faces = face_engine.get_faces(image)

    print("Faces Detected:", len(faces))

    if len(faces) == 0:
        raise Exception("No face detected")

    # -------------------------------
    # Get detected face
    # -------------------------------
    face = faces[0]

    live_embedding = face.embedding

    bbox = face.bbox

    face_box = {
        "x": int(bbox[0]),
        "y": int(bbox[1]),
        "width": int(bbox[2] - bbox[0]),
        "height": int(bbox[3] - bbox[1]),
    }

    print("Face Box:", face_box)

    # -------------------------------
    # Compare with enrolled faces
    # -------------------------------
    stored_faces = db.query(FaceEmbedding).all()

    print("Stored Faces:", len(stored_faces))

    if len(stored_faces) == 0:
        return {
            "verified": False,
            "message": "No enrolled faces found.",
            "face_box": face_box,
        }

    best_score = -1
    best_face = None

    for stored_face in stored_faces:

        score = cosine_similarity(
            live_embedding,
            stored_face.embedding,
        )

        print(
            f"Face ID: {stored_face.id} | Similarity: {score:.4f}"
        )

        if score > best_score:
            best_score = score
            best_face = stored_face

    print("Best Score:", best_score)

    THRESHOLD = 0.60

    # -------------------------------
    # Unknown Person
    # -------------------------------
    if best_score < THRESHOLD:

        return {
            "verified": False,
            "confidence": round(best_score * 100, 2),
            "message": "Unknown Person",
            "face_box": face_box,
        }

    # -------------------------------
    # Verified Person
    # -------------------------------
    user = (
        db.query(User)
        .filter(User.id == best_face.user_id)
        .first()
    )

    return {
        "verified": True,
        "confidence": round(best_score * 100, 2),
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