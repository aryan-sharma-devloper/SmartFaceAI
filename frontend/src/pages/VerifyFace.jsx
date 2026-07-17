import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function VerifyFace() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [deviceId, setDeviceId] = useState("");

  // -----------------------------
  // Detect Cameras
  // -----------------------------
  useEffect(() => {
    async function loadCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );

        console.log("Available Cameras:");
        console.table(cameras);

        const hpCamera = cameras.find((camera) =>
          camera.label.includes("HP Wide Vision")
        );

        if (hpCamera) {
          console.log("Using HP Camera:", hpCamera.label);
          setDeviceId(hpCamera.deviceId);
        } else if (cameras.length > 0) {
          console.log("Using First Camera:", cameras[0].label);
          setDeviceId(cameras[0].deviceId);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadCameras();
  }, []);

  // -----------------------------
  // Draw Face Box
  // -----------------------------
  const drawFaceBox = (faceBox, name, confidence) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!faceBox) return;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#00ff00";

    ctx.strokeRect(
      faceBox.x,
      faceBox.y,
      faceBox.width,
      faceBox.height
    );

    ctx.fillStyle = "#00ff00";
    ctx.font = "20px Arial";

    ctx.fillText(
      `${name} (${confidence}%)`,
      faceBox.x,
      faceBox.y - 10
    );
  };

  // -----------------------------
  // Verify Face
  // -----------------------------
  const verifyFace = async () => {
    if (loading || isVerified) return;

    try {
      setLoading(true);

     const imageSrc = webcamRef.current?.getScreenshot();

     console.log("IMAGE:", imageSrc);
     if (!imageSrc) {
  console.log("Screenshot is NULL");
  return;
} 

      if (!imageSrc) {
        setLoading(false);
        return;
      }

      const blob = await fetch(imageSrc).then((res) => res.blob());

      const formData = new FormData();
      formData.append("image", blob, "verify.jpg");

      const response = await api.post(
        "/faces/verify",
        formData
      );

      setResult(response.data);

      if (response.data.face_box) {
        drawFaceBox(
          response.data.face_box,
          response.data.verified
            ? response.data.user.full_name
            : "Unknown",
          response.data.confidence ?? 0
        );
      }

      if (response.data.verified) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Auto Verify Every Second
  // -----------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      verifyFace();
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, isVerified]);

  // -----------------------------
  // Reset
  // -----------------------------
  const resetVerification = () => {
    setResult(null);
    setIsVerified(false);

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          Smart Face Verification
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
        >
          Dashboard
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Webcam */}
        <div className="bg-white rounded-xl shadow-lg p-6">

          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">

  <Webcam
  ref={webcamRef}
  audio={false}
  mirrored={false}
  screenshotFormat="image/jpeg"
  screenshotQuality={1}
  videoConstraints={{
    width: 640,
    height: 480,
    facingMode: "user",
  }}
  className="absolute inset-0 w-full h-full object-cover"
/>

<canvas
  ref={canvasRef}
  width={640}
  height={480}
  className="absolute inset-0 w-full h-full pointer-events-none"
/>

</div>

          <div className="mt-5 text-center">

            {loading && (
              <p className="text-blue-600 text-xl font-bold">
                🔍 Scanning Face...
              </p>
            )}

            {!loading && !isVerified && (
              <p className="text-gray-500">
                Waiting for face...
              </p>
            )}

            {isVerified && (
              <p className="text-green-600 text-xl font-bold">
                ✅ Face Verified
              </p>
            )}

          </div>

        </div>

        {/* Result */}
        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-3xl font-bold mb-6">
            Verification Result
          </h2>

          {!result && (
            <p className="text-gray-500">
              Waiting for verification...
            </p>
          )}

          {result?.verified && (
            <div>

              <div className="text-3xl font-bold text-green-600 mb-6">
                ✅ VERIFIED
              </div>

              <p><strong>Employee ID:</strong> {result.user.employee_id}</p>
              <p><strong>Name:</strong> {result.user.full_name}</p>
              <p><strong>Department:</strong> {result.user.department}</p>
              <p><strong>Email:</strong> {result.user.email}</p>
              <p><strong>Phone:</strong> {result.user.phone}</p>

              <div className="mt-8 text-2xl font-bold text-blue-700">
                Confidence: {result.confidence}%
              </div>

              <button
                onClick={resetVerification}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
              >
                Verify Another Person
              </button>

            </div>
          )}

          {result && !result.verified && (
            <div>

              <div className="text-3xl font-bold text-red-600 mb-6">
                ❌ UNKNOWN PERSON
              </div>

              <p className="text-xl">
                Confidence: {result.confidence}%
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default VerifyFace;