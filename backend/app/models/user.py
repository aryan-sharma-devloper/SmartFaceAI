from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    String,
    Text,
    func,
)

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)

    employee_id = Column(String(20), unique=True, nullable=False)

    full_name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    department = Column(String(100), nullable=False)

    phone = Column(String(15))

    profile_photo = Column(Text)

    status = Column(Boolean, default=True)

    is_deleted = Column(Boolean, default=False)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )