from datetime import date, time, datetime
from typing import Optional

from pydantic import BaseModel


class AttendanceBase(BaseModel):
    user_id: int
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    working_hours: Optional[str] = None
    status: str = "Present"
    camera_name: str = "Main Camera"


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True