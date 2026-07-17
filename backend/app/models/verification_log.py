from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    func,
)

from app.database.base import Base


class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=True,
    )

    confidence_score = Column(
        Numeric(5, 2),
        nullable=False,
    )

    status = Column(
        String(20),
        nullable=False,
    )

    camera_name = Column(
        String(100),
        default="Default Camera",
    )

    response_time_ms = Column(
        BigInteger,
        default=0,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )