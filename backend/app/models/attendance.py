from sqlalchemy import (
    BigInteger,
    Column,
    Date,
    DateTime,
    ForeignKey,
    String,
    Time,
    func,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    date = Column(
        Date,
        nullable=False,
    )

    check_in = Column(Time)

    check_out = Column(Time)

    working_hours = Column(String(20))

    status = Column(
        String(20),
        default="Present",
    )

    camera_name = Column(
        String(100),
        default="Main Camera",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    user = relationship("User")