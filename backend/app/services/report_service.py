from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.attendance import Attendance
from app.models.user import User


def get_attendance_report(
    db: Session,
    from_date=None,
    to_date=None,
    department=None,
    status=None,
    employee=None,
):
    query = (
        db.query(Attendance, User)
        .join(User, Attendance.user_id == User.id)
    )

    # ----------------------------
    # Date Filter
    # ----------------------------
    if from_date:
        query = query.filter(
            Attendance.date >= from_date
        )

    if to_date:
        query = query.filter(
            Attendance.date <= to_date
        )

    # ----------------------------
    # Department Filter
    # ----------------------------
    if department:
        query = query.filter(
            User.department == department
        )

    # ----------------------------
    # Status Filter
    # ----------------------------
    if status:
        query = query.filter(
            Attendance.status == status
        )

    # ----------------------------
    # Employee Search
    # ----------------------------
    if employee:
        query = query.filter(
            User.full_name.ilike(f"%{employee}%")
        )

    results = query.order_by(
        Attendance.date.desc()
    ).all()

    report = []

    for attendance, user in results:

        report.append(
            {
                "employee_id": user.employee_id,
                "full_name": user.full_name,
                "department": user.department,
                "date": attendance.date,
                "check_in": attendance.check_in,
                "check_out": attendance.check_out,
                "working_hours": attendance.working_hours,
                "status": attendance.status,
            }
        )

    return report