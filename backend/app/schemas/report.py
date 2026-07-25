from pydantic import BaseModel
from datetime import date, time


class AttendanceReport(BaseModel):
    employee_id: str
    full_name: str
    department: str

    date: date

    check_in: time | None
    check_out: time | None

    working_hours: str | None

    status: str

    class Config:
        from_attributes = True