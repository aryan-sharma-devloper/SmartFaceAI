from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.database import get_db
from app.auth.dependencies import get_current_admin

from app.models.attendance import Attendance
from app.models.user import User

from app.services.report_service import get_attendance_report
from app.services.excel_service import generate_attendance_excel
from app.services.report_stats_service import get_report_stats
router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/attendance")
def attendance_report(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    employee: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return get_attendance_report(
        db=db,
        from_date=from_date,
        to_date=to_date,
        department=department,
        status=status,
        employee=employee,
    )
@router.get("/attendance/stats")
def attendance_stats(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return get_report_stats(db)
@router.get("/attendance/excel")
def export_attendance_excel(
    employee: str | None = None,
    department: str | None = None,
    status: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    query = (
        db.query(Attendance, User)
        .join(User)
    )

    if employee:
        query = query.filter(
            or_(
                User.employee_id.ilike(f"%{employee}%"),
                User.full_name.ilike(f"%{employee}%"),
            )
        )

    if department:
        query = query.filter(
            User.department == department
        )

    if status:
        query = query.filter(
            Attendance.status == status
        )

    if from_date:
        query = query.filter(
            Attendance.date >= from_date
        )

    if to_date:
        query = query.filter(
            Attendance.date <= to_date
        )

    records = []

    for attendance, user in query.all():

        records.append(
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

    excel = generate_attendance_excel(records)

    return StreamingResponse(
        excel,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            "attachment; filename=Attendance_Report.xlsx"
        },
    )