from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.auth.dependencies import get_current_admin
from app.database.database import get_db

from app.models.user import User
from app.models.face_embedding import FaceEmbedding
from app.models.verification_log import VerificationLog

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def dashboard(
    db: Session =Depends(get_db),
    admin=Depends(get_current_admin),
):

    total_users = db.query(User).count()

    total_faces = db.query(FaceEmbedding).count()

    verified_today = (
        db.query(VerificationLog)
        .filter(
            func.date(VerificationLog.created_at) == date.today(),
            VerificationLog.status == "verified",
        )
        .count()
    )

    unknown_today = (
        db.query(VerificationLog)
        .filter(
            func.date(VerificationLog.created_at) == date.today(),
            VerificationLog.status == "failed",
        )
        .count()
    )

    recent_users = (
        db.query(User)
        .order_by(User.id.desc())
        .limit(5)
        .all()
    )

    recent_logs = (
        db.query(VerificationLog)
        .order_by(VerificationLog.id.desc())
        .limit(5)
        .all()
    )

    return {

        "users": total_users,

        "faces": total_faces,

        "verified_today": verified_today,

        "unknown_today": unknown_today,

        "recent_users": [

            {
                "employee_id": u.employee_id,
                "full_name": u.full_name,
                "department": u.department,
            }

            for u in recent_users
        ],

        "recent_logs": [

            {

                "status": l.status,
                "confidence": l.confidence_score,
                "created_at": l.created_at,
                "user_id": l.user_id,

            }

            for l in recent_logs

        ],

    }