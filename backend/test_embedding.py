from app.ai.embedding import generate_embedding

embedding = generate_embedding("test_images/person.jpg")

print("Embedding Length:", len(embedding))
print("First 10 Values:")
print(embedding[:10])