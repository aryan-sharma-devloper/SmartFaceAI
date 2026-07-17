from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.admin import Admin
from app.auth.hashing import hash_password


def create_admin():
    db: Session = SessionLocal()

    username = "admin"
    email = "admin@example.com"
    password = "admin123"

    existing_admin = db.query(Admin).filter(Admin.username == username).first()

    if existing_admin:
        print("Admin already exists.")
        db.close()
        return

    admin = Admin(
    username="admin",
    full_name="System Administrator",
    email="admin@example.com",
    password_hash=hash_password("admin123"),
    role="admin",
    is_active=True
)

    db.add(admin)
    db.commit()
    db.close()

    print("Admin created successfully!")
    print("Username:", username)
    print("Password:", password)


if __name__ == "__main__":
    create_admin()