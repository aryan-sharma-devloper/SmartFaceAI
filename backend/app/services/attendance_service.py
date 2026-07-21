from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models.attendance import Attendance


def mark_attendance(
    db: Session,
    user_id: int,
    camera_name: str = "Main Camera",
):

    today = date.today()

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.user_id == user_id,
            Attendance.date == today,
        )
        .first()
    )

    # Already checked in and checked out
    if attendance and attendance.check_out:
        return attendance

    # First check-in
    if attendance is None:

        attendance = Attendance(
            user_id=user_id,
            date=today,
            check_in=datetime.now().time(),
            status="Present",
            camera_name=camera_name,
        )

        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        return attendance

    # Check-out
    if attendance.check_out is None:

        attendance.check_out = datetime.now().time()

        check_in_dt = datetime.combine(
            today,
            attendance.check_in,
        )

        check_out_dt = datetime.combine(
            today,
            attendance.check_out,
        )

        duration = check_out_dt - check_in_dt

        attendance.working_hours = str(duration)

        db.commit()
        db.refresh(attendance)

    return attendance