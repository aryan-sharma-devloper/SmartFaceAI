import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import api from "../api/axios";

function EnrollFace() {
  const webcamRef = useRef(null);

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const captureFace = async () => {
    try {
      setLoading(true);

      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        alert("Unable to capture image.");
        return;
      }

      // Convert Base64 → Blob
      const blob = await fetch(imageSrc).then((res) => res.blob());

      const formData = new FormData();

      formData.append("image", blob, "face.jpg");

      const token = localStorage.getItem("token");

      const response = await api.post(
        `/faces/enroll/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);

      navigate("/users");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Enrollment Failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      <h1 className="text-4xl font-bold mt-8 text-blue-700">
        Face Enrollment
      </h1>

      <p className="text-gray-500 mt-2">
        Position your face inside the camera
      </p>

      <div className="mt-8 shadow-xl rounded-xl overflow-hidden">

       <Webcam
  ref={webcamRef}
  audio={false}
  screenshotFormat="image/jpeg"
  width={700}
  height={500}
  mirrored={false}
/>

      </div>

      <button
        onClick={captureFace}
        disabled={loading}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
      >
        {loading ? "Uploading..." : "Capture & Enroll"}
      </button>

      <button
        onClick={() => navigate("/users")}
        className="mt-4 bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg"
      >
        Back
      </button>

    </div>
  );
}

export default EnrollFace;