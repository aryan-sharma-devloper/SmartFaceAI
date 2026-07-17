import time

from sqlalchemy.orm import Session

from app.ai.embedding import generate_embedding
from app.ai.similarity import cosine_similarity
from app.models.face_embedding import FaceEmbedding
from app.models.verification_log import VerificationLog
from app.core.config import settings


def verify_face(
    db: Session,
    user_id: int,
    image_path: str,
    camera_name: str = "Web Camera",
):
    """
    Verify a user's face against the enrolled embedding
    and save the verification result.
    """

    start_time = time.perf_counter()

    # Generate embedding from uploaded image
    live_embedding = generate_embedding(image_path)

    # Load enrolled face
    stored_face = (
        db.query(FaceEmbedding)
        .filter(FaceEmbedding.user_id == user_id)
        .first()
    )

    if stored_face is None:
        raise Exception("No enrolled face found for this user.")

    # Calculate similarity
    score = cosine_similarity(
        live_embedding,
        stored_face.embedding,
    )

    verified = score >= settings.FACE_SIMILARITY_THRESHOLD

    response_time = int((time.perf_counter() - start_time) * 1000)

    # Save verification log
    log = VerificationLog(
        user_id=user_id,
        confidence_score=round(score, 2),
        status="VERIFIED" if verified else "FAILED",
        camera_name=camera_name,
        response_time_ms=response_time,
    )

    db.add(log)
    db.commit()

    return {
        "verified": verified,
        "similarity": round(score, 4),
        "response_time_ms": response_time,
    }