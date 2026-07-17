from app.database.database import SessionLocal
from app.services.verification_service import verify_face

db = SessionLocal()

result = verify_face(
    db=db,
    user_id=1,
    image_path="test_images/person.jpg",
)

print(result)