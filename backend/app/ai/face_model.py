from insightface.app import FaceAnalysis

# Load the ArcFace model once when the application starts
face_app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"],
)

face_app.prepare(
    ctx_id=0,
    det_size=(640, 640),
)