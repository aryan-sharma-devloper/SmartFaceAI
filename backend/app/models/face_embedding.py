from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
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

    pose = Column(String(20))

    quality_score = Column(Numeric(5, 2))

    model_name = Column(
        String(50),
        default="ArcFace",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )