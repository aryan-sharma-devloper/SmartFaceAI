from datetime import datetime
from pydantic import BaseModel


class FaceResponse(BaseModel):
    id: int
    user_id: int
    image_path: str | None = None
    pose: str | None = None
    quality_score: float | None = None
    model_name: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class FaceEnrollResponse(BaseModel):
    message: str
    face_id: int
    user_id: int