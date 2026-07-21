from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
    UniqueConstraint,
)

from pgvector.sqlalchemy import Vector
from app.database.base import Base


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(BigInteger, primary_key=True, index=True)

    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    embedding = Column(
        Vector(512),
        nullable=False,
    )

    image_path = Column(Text)

    # front / left / right / up / down
    pose = Column(
        String(20),
        nullable=False,
    )

    quality_score = Column(
        Numeric(5, 2),
        default=99.00,
    )

    model_name = Column(
        String(50),
        default="ArcFace",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "pose",
            name="unique_user_pose",
        ),
    )