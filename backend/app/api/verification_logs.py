from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_admin

from app.models.verification_log import VerificationLog
from app.models.user import User

router = APIRouter(
    prefix="/logs",
    tags=["Verification Logs"],
)


@router.get("/")
def get_logs(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    logs = (
        db.query(VerificationLog)
        .order_by(VerificationLog.created_at.desc())
        .all()
    )

    data = []

    for log in logs:

        user = db.query(User).filter(User.id == log.user_id).first()

        data.append(
    {
        "id": log.id,
        "employee_id": user.employee_id if user else "-",
        "full_name": user.full_name if user else "Unknown",
        "department": user.department if user else "-",
        "status": log.status,
        "confidence": log.confidence_score,
        "camera": log.camera_name,
        "response_time": log.response_time_ms,
        "created_at": log.created_at,
    }
)

    return data