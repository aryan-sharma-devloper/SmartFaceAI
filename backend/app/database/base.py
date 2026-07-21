from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models AFTER Base is created
from app.models.attendance import Attendance