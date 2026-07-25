from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.user import User


def get_report_stats(db: Session):

    total_employees = (
        db.query(User)
        .filter(User.is_deleted == False)
        .count()
    )

    present = (
        db.query(Attendance)
        .filter(Attendance.status == "Present")
        .count()
    )

    absent = (
        db.query(Attendance)
        .filter(Attendance.status == "Absent")
        .count()
    )

    late = (
        db.query(Attendance)
        .filter(Attendance.status == "Late")
        .count()
    )

    average_hours = (
        db.query(func.avg(Attendance.working_hours))
        .scalar()
    )

    return {
        "totalEmployees": total_employees,
        "present": present,
        "absent": absent,
        "late": late,
        "averageHours": round(average_hours or 0, 2),
    }