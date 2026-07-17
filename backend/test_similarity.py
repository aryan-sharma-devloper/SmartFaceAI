from app.ai.embedding import generate_embedding
from app.ai.similarity import cosine_similarity

embedding1 = generate_embedding("test_images/person.jpg")
embedding2 = generate_embedding("test_images/person.jpg")

score = cosine_similarity(embedding1, embedding2)

print("Similarity:", score)