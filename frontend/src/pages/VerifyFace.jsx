import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
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
  // Detect Camera
  // -----------------------------
  useEffect(() => {
    async function loadCamera() {
      try {
        const devices =
          await navigator.mediaDevices.enumerateDevices();

        const cameras = devices.filter(
          (d) => d.kind === "videoinput"
        );

        const hpCamera = cameras.find((camera) =>
          camera.label.includes("HP Wide Vision")
        );

        if (hpCamera) {
          setDeviceId(hpCamera.deviceId);
        } else if (cameras.length > 0) {
          setDeviceId(cameras[0].deviceId);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadCamera();
  }, []);

  // -----------------------------
  // Draw Face Box
  // -----------------------------
  function drawFaceBox(faceBox, name, confidence) {
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
  }

  // -----------------------------
  // Verify Face
  // -----------------------------
  async function verifyFace() {
    if (loading || isVerified) return;

    setLoading(true);

    try {
      const imageSrc =
        webcamRef.current?.getScreenshot();

      if (!imageSrc) {
        return;
      }

      const blob = await fetch(imageSrc).then((r) =>
        r.blob()
      );

      const formData = new FormData();

      formData.append(
        "image",
        blob,
        "verify.jpg"
      );

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

        toast.success("Face Verified");
      }

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
        "Verification Failed"
      );

    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Auto Verify
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
  function resetVerification() {
    setResult(null);
    setIsVerified(false);

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    toast.success("Ready for next verification");
  }
  

  return (
  <div className="min-h-screen bg-gray-100 p-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">

      <h1 className="text-4xl font-bold text-blue-700">
        Smart Face Verification
      </h1>

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow"
      >
        Dashboard
      </button>

    </div>

    <div className="grid lg:grid-cols-2 gap-8">

      {/* ================= CAMERA ================= */}

      <div className="bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-5">
          Live Camera
        </h2>

        <div className="relative rounded-xl overflow-hidden border">

          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            videoConstraints={{
              width: 640,
              height: 480,
              deviceId: deviceId || undefined,
            }}
            className="w-full"
          />

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

        </div>

        <div className="mt-6 flex justify-center">

          {loading ? (

            <div className="flex flex-col items-center">

              <ClipLoader
                size={35}
                color="#2563eb"
              />

              <p className="mt-3 font-semibold text-blue-600">
                Scanning Face...
              </p>

            </div>

          ) : isVerified ? (

            <div className="text-green-600 font-bold text-xl">
              ✅ Face Verified
            </div>

          ) : (

            <div className="text-gray-500 animate-pulse">
              👀 Looking for a face...
            </div>

          )}

        </div>

      </div>

      {/* ================= RESULT ================= */}

      <div className="bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-3xl font-bold mb-6">
          Verification Result
        </h2>

        {!result && (

          <div className="text-center py-24">

            <div className="text-6xl mb-4">
              📷
            </div>

            <p className="text-gray-500 text-lg">
              Waiting for verification...
            </p>

          </div>

        )}

        {result?.verified && (

          <>

            <div className="bg-green-100 border border-green-400 rounded-xl p-5">

              <h3 className="text-3xl font-bold text-green-700 mb-5">
                ✅ VERIFIED
              </h3>

              <div className="space-y-3 text-lg">

                <p>
                  <strong>Employee ID:</strong>{" "}
                  {result.user.employee_id}
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {result.user.full_name}
                </p>

                <p>
                  <strong>Department:</strong>{" "}
                  {result.user.department}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {result.user.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {result.user.phone || "-"}
                </p>

              </div>

            </div>

            <div className="mt-6 bg-blue-50 rounded-xl p-5">

              <h3 className="text-lg font-semibold">
                Match Confidence
              </h3>

              <p className="text-5xl font-bold text-blue-700 mt-3">
                {result.confidence}%
              </p>

            </div>

            <button
              onClick={resetVerification}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg"
            >
              🔄 Verify Another Person
            </button>

          </>

        )}

        {result && !result.verified && (

          <div className="bg-red-50 border border-red-300 rounded-xl p-6">

            <h3 className="text-3xl font-bold text-red-700">
              ❌ Unknown Person
            </h3>

            <p className="mt-5 text-lg">
              No matching employee found.
            </p>

            <div className="mt-6">

              <h4 className="font-semibold">
                Confidence
              </h4>

              <p className="text-5xl font-bold text-red-600 mt-2">
                {result.confidence}%
              </p>

            </div>

            <button
              onClick={resetVerification}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
            >
              Try Again
            </button>

          </div>

        )}

          </div>

    </div>

  </div>
  );
}

export default VerifyFace;