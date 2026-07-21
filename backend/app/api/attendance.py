from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.attendance import Attendance
from app.models.user import User
from app.services.attendance_service import mark_attendance

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


# =====================================================
# Manual Check-In
# =====================================================
@router.post("/check-in/{user_id}")
def check_in(
    user_id: int,
    db: Session = Depends(get_db),
):
    return mark_attendance(
        db=db,
        user_id=user_id,
    )


# =====================================================
# Today's Attendance
# =====================================================
@router.get("/today")
def get_today_attendance(
    db: Session = Depends(get_db),
):
    today = date.today()

    records = (
        db.query(Attendance, User)
        .join(User, Attendance.user_id == User.id)
        .filter(Attendance.date == today)
        .order_by(Attendance.check_in.desc())
        .all()
    )

    response = []

    for attendance, user in records:

        response.append({

            "id": attendance.id,

            "employee_id": user.employee_id,

            "full_name": user.full_name,

            "department": user.department,

            "email": user.email,

            "phone": user.phone,

            "date": attendance.date,

            "check_in": attendance.check_in,

            "check_out": attendance.check_out,

            "working_hours": attendance.working_hours,

            "status": attendance.status,

            "camera_name": attendance.camera_name,

        })

    return response


# =====================================================
# All Attendance
# =====================================================
# =====================================================
# All Attendance (Search by Employee Name / ID)
# =====================================================
@router.get("/")
def get_all_attendance(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):

    query = (
        db.query(Attendance, User)
        .join(User, Attendance.user_id == User.id)
    )

    # Search by employee name or employee ID
    if search:

        query = query.filter(

            (User.full_name.ilike(f"%{search}%")) |

            (User.employee_id.ilike(f"%{search}%"))

        )

    records = (
        query.order_by(
            Attendance.date.desc(),
            Attendance.check_in.desc(),
        )
        .all()
    )

    response = []

    for attendance, user in records:

        response.append({

            "id": attendance.id,

            "employee_id": user.employee_id,

            "full_name": user.full_name,

            "department": user.department,

            "email": user.email,

            "phone": user.phone,

            "date": attendance.date,

            "check_in": attendance.check_in,

            "check_out": attendance.check_out,

            "working_hours": attendance.working_hours,

            "status": attendance.status,

            "camera_name": attendance.camera_name,

        })

    return response


# =====================================================
# Attendance History of One Employee
# =====================================================
@router.get("/user/{user_id}")
def get_user_attendance(
    user_id: int,
    db: Session = Depends(get_db),
):

    records = (
        db.query(Attendance, User)
        .join(User, Attendance.user_id == User.id)
        .filter(User.id == user_id)
        .order_by(Attendance.date.desc())
        .all()
    )

    response = []

    for attendance, user in records:

        response.append({

            "id": attendance.id,

            "employee_id": user.employee_id,

            "full_name": user.full_name,

            "department": user.department,

            "email": user.email,

            "phone": user.phone,

            "date": attendance.date,

            "check_in": attendance.check_in,

            "check_out": attendance.check_out,

            "working_hours": attendance.working_hours,

            "status": attendance.status,

            "camera_name": attendance.camera_name,

        })

    return response


# =====================================================
# Dashboard Statistics
# =====================================================
@router.get("/stats")
def attendance_stats(
    db: Session = Depends(get_db),
):

    today = date.today()

    total_users = db.query(User).count()

    present_today = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "Present",
        )
        .count()
    )

    checked_out = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.check_out.isnot(None),
        )
        .count()
    )

    total_today = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
        )
        .count()
    )

    return {

        "total_users": total_users,

        "present_today": present_today,

        "checked_out": checked_out,

        "total_today": total_today,

    }