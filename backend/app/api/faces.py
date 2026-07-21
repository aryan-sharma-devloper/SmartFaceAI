from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session
import traceback

from app.auth.dependencies import get_current_admin
from app.database.database import get_db
from app.schemas.face import FaceEnrollResponse
from app.services.face_service import (
    enroll_face,
    verify_face,
)

router = APIRouter(
    prefix="/faces",
    tags=["Face Recognition"],
)

# ---------------------------------------
# Face Enrollment (5 Pose Support)
# ---------------------------------------
@router.post(
    "/enroll/{user_id}/{pose}",
    response_model=FaceEnrollResponse,
)
async def enroll(
    user_id: int,
    pose: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    image_bytes = await image.read()

    pose = pose.lower()

    valid_poses = [
        "front",
        "left",
        "right",
        "up",
        "down",
    ]

    if pose not in valid_poses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid pose. Allowed poses: {valid_poses}",
        )

    try:
        face = enroll_face(
            db=db,
            user_id=user_id,
            pose=pose,
            image_bytes=image_bytes,
        )

        if face is None:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        return {
            "message": f"{pose.capitalize()} face enrolled successfully",
            "face_id": face.id,
            "user_id": face.user_id,
            "pose": face.pose,
        }

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ---------------------------------------
# Face Verification
# ---------------------------------------
@router.post("/verify")
async def verify(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    image_bytes = await image.read()

    try:
        result = verify_face(
            db=db,
            image_bytes=image_bytes,
        )

        return result

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )