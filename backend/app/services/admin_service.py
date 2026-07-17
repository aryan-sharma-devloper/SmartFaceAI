from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.auth.hashing import hash_password


def create_admin(
    db: Session,
    username: str,
    full_name: str,
    email: str,
    password: str,
):
    existing = db.query(Admin).filter(Admin.username == username).first()

    if existing:
        return None

    admin = Admin(
        username=username,
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role="admin",
        is_active=True,
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin