from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models.attendance import Attendance


MIN_CHECKOUT_MINUTES = 30   # Change if needed


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

    # Already checked out
    if attendance and attendance.check_out:
        return attendance

    # First Check-In
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

    # -----------------------------
    # Prevent instant checkout
    # -----------------------------

    check_in_dt = datetime.combine(
        today,
        attendance.check_in,
    )

    now_dt = datetime.now()

    minutes = (
        now_dt - check_in_dt
    ).total_seconds() / 60

    if minutes < MIN_CHECKOUT_MINUTES:
        return attendance

    # -----------------------------
    # Check-Out
    # -----------------------------

    attendance.check_out = now_dt.time()

    duration = now_dt - check_in_dt

    attendance.working_hours = str(duration)

    db.commit()
    db.refresh(attendance)

    return attendance