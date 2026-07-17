from sqlalchemy.orm import Session

from app.models.user import User


def create_user(db: Session, user_data):
    # Check if employee ID already exists
    existing_employee = (
        db.query(User)
        .filter(User.employee_id == user_data.employee_id)
        .first()
    )

    if existing_employee:
        return None

    # Check if email already exists
    existing_email = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_email:
        return None

    user = User(
        employee_id=user_data.employee_id,
        full_name=user_data.full_name,
        email=user_data.email,
        department=user_data.department,
        phone=user_data.phone,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_all_users(db: Session):
    return (
        db.query(User)
        .filter(User.is_deleted == False)
        .all()
    )


def get_user_by_id(db: Session, user_id: int):
    return (
        db.query(User)
        .filter(
            User.id == user_id,
            User.is_deleted == False,
        )
        .first()
    )


def update_user(db: Session, user_id: int, user_data):
    user = get_user_by_id(db, user_id)

    if user is None:
        return None

    user.employee_id = user_data.employee_id
    user.full_name = user_data.full_name
    user.email = user_data.email
    user.department = user_data.department
    user.phone = user_data.phone

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)

    if user is None:
        return None

    user.is_deleted = True

    db.commit()

    return user