import cv2
import numpy as np

from app.ai.face_model import face_app


def generate_embedding(image_path: str):
    """
    Generate a 512-dimensional face embedding from an image.
    """

    image = cv2.imread(image_path)

    if image is None:
        raise Exception("Could not read image.")

    faces = face_app.get(image)

    if len(faces) == 0:
        raise Exception("No face detected.")

    if len(faces) > 1:
        raise Exception("Multiple faces detected.")

    embedding = faces[0].embedding

    return np.array(embedding, dtype=np.float32)