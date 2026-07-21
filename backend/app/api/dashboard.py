from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, extract
from sqlalchemy.orm import Session

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
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):

    # =====================================
    # Dashboard Cards
    # =====================================

    total_users = (
    db.query(User)
    .filter(User.is_deleted == False)
    .count()
)
    total_faces = db.query(FaceEmbedding).count()

    verified_today = (
        db.query(VerificationLog)
        .filter(
            func.date(VerificationLog.created_at) == date.today(),
            VerificationLog.status == "verified",
        )
        .count()
    )

    failed_today = (
        db.query(VerificationLog)
        .filter(
            func.date(VerificationLog.created_at) == date.today(),
            VerificationLog.status == "failed",
        )
        .count()
    )

    # =====================================
    # Recent Users
    # =====================================

    recent_users = (
    db.query(User)
    .filter(User.is_deleted == False)
    .order_by(User.id.desc())
    .limit(5)
    .all()
)

    # =====================================
    # Recent Logs
    # =====================================

    recent_logs = (
        db.query(VerificationLog)
        .order_by(VerificationLog.id.desc())
        .limit(5)
        .all()
    )

    # =====================================
    # Weekly Chart
    # =====================================

    weekly = []

    for i in range(6, -1, -1):

        current_day = date.today() - timedelta(days=i)

        verified = (
            db.query(VerificationLog)
            .filter(
                func.date(VerificationLog.created_at) == current_day,
                VerificationLog.status == "verified",
            )
            .count()
        )

        weekly.append(
            {
                "day": current_day.strftime("%a"),
                "verified": verified,
            }
        )

    # =====================================
    # Pie Chart
    # =====================================

    verified_total = (
        db.query(VerificationLog)
        .filter(
            VerificationLog.status == "verified"
        )
        .count()
    )

    failed_total = (
        db.query(VerificationLog)
        .filter(
            VerificationLog.status == "failed"
        )
        .count()
    )

    pie = {
        "verified": verified_total,
        "failed": failed_total,
    }

    # =====================================
    # Monthly Trend
    # =====================================

    month_names = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    current_year = date.today().year

    monthly = []

    for month in range(1, 13):

        verified = (
            db.query(VerificationLog)
            .filter(
                extract("year", VerificationLog.created_at) == current_year,
                extract("month", VerificationLog.created_at) == month,
                VerificationLog.status == "verified",
            )
            .count()
        )

        monthly.append(
            {
                "month": month_names[month - 1],
                "verified": verified,
            }
        )

    # =====================================
    # Response
    # =====================================

    return {

        # Cards

        "users": total_users,
        "faces": total_faces,
        "verified_today": verified_today,
        "failed_today": failed_today,

        # Charts

        "weekly": weekly,
        "pie": pie,
        "monthly": monthly,

        # Recent Users

        "recent_users": [
            {
                "employee_id": user.employee_id,
                "full_name": user.full_name,
                "department": user.department,
            }
            for user in recent_users
        ],

        # Recent Logs

 "recent_logs": [
    {
        "user_id": log.user_id,
        "employee_id": (
            db.query(User)
            .filter(User.id == log.user_id)
            .first()
            .employee_id
            if db.query(User).filter(User.id == log.user_id).first()
            else "-"
        ),
        "full_name": (
            db.query(User)
            .filter(User.id == log.user_id)
            .first()
            .full_name
            if db.query(User).filter(User.id == log.user_id).first()
            else "Unknown"
        ),
        "status": log.status,
        "confidence": log.confidence_score,
        "created_at": log.created_at,
    }
    for log in recent_logs
],
    }