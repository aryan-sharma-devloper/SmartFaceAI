from app.database.database import SessionLocal
from app.services.face_service import enroll_face

db = SessionLocal()

face = enroll_face(
    db=db,
    user_id=3,
    image_path="test_images/person.jpg",
    pose="front",
)

print("Face enrolled successfully!")
print("Face ID:", face.id)