import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import api from "../api/axios";

function VerifyFace() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const verifyingRef = useRef(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [deviceId, setDeviceId] = useState("");

  // ------------------------------------
  // Load Camera
  // ------------------------------------
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

  // ------------------------------------
  // Draw Face Boxes
  // ------------------------------------
  function drawFaceBoxes(faces) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      const box = face.face_box;

      ctx.lineWidth = 4;

      if (face.verified) {
        ctx.strokeStyle = "#00ff00";
        ctx.fillStyle = "#00ff00";
      } else {
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
      }

      ctx.strokeRect(
        box.x,
        box.y,
        box.width,
        box.height
      );

      const label = face.verified
        ? `${face.user.full_name} (${face.confidence}%)`
        : `Unknown (${face.confidence}%)`;

      ctx.font = "18px Arial";
      ctx.fillText(label, box.x, box.y - 10);
    });
  }

  // ------------------------------------
  // Verify Faces
  // ------------------------------------
  async function verifyFace() {
    if (verifyingRef.current) return;

verifyingRef.current = true;
setLoading(true);

    try {
  const imageSrc = webcamRef.current?.getScreenshot();

  if (!imageSrc) {
    setLoading(false);
    return;
  }

  const blob = await fetch(imageSrc).then((r) => r.blob());

  const formData = new FormData();
  formData.append("image", blob, "verify.jpg");

  const response = await api.post("/faces/verify", formData);

  console.log("VERIFY RESPONSE:", response.data);

  const data = response.data;

  if (!data) {
    toast.error("Backend returned null");
    return;
  }

  if (!Array.isArray(data.faces)) {
    toast.error("Invalid response from backend");
    console.log(data);
    return;
  }

  console.log("FULL RESPONSE:", response.data);

setResult(response.data);

if (response.data?.faces) {
    drawFaceBoxes(response.data.faces);
}

  if (response.data &&
    response.data.faces &&
    response.data.faces.length > 0 &&
    response.data.faces[0].verified) {
    toast.success(`${data.faces[0].user.full_name} Verified`);
  }
}
catch (error) {
  console.error(error);

  toast.error(
    error.response?.data?.detail ||
    "Verification Failed"
  );
}
finally {
    setLoading(false);
    verifyingRef.current = false;
}
  }
  // ------------------------------------
// Auto Scan Every Second
// ------------------------------------
useEffect(() => {
    const interval = setInterval(() => {

        // Only scan if previous request finished
        if (!verifyingRef.current) {
            verifyFace();
        }

    }, 1000);

    return () => clearInterval(interval);

}, []);
  // ------------------------------------
  // Reset
  // ------------------------------------
  function resetVerification() {
    setResult(null);

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

  // ------------------------------------
  // UI
  // ------------------------------------
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
    <button
    onClick={() => {
        if (!verifyingRef.current) {
            verifyFace();
        }
    }}
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
  >
    {loading ? "Verifying..." : "Verify Face"}
  </button>
          </div>

          <div className="mt-6 flex justify-center">

            {loading ? (

              <div className="flex flex-col items-center">

                <ClipLoader
                  size={35}
                  color="#2563eb"
                />

                <p className="mt-3 font-semibold text-blue-600">
                  Scanning Faces...
                </p>

              </div>

            ) : result?.verified_faces > 0 ? (

              <div className="text-green-600 font-bold text-xl">
                ✅ {result.verified_faces} Face(s) Verified
              </div>

            ) : (

              <div className="text-gray-500 animate-pulse">
                👀 Looking for Faces...
              </div>

            )}

          </div>

        </div>

        {/* ================= RESULTS ================= */}

        <div className="bg-white rounded-2xl shadow-xl p-6">

          <h2 className="text-3xl font-bold mb-6">
            Verification Results
          </h2>

          {!result && (

            <div className="text-center py-20">

              <div className="text-6xl mb-4">
                📷
              </div>

              <p className="text-gray-500 text-lg">
                Waiting for faces...
              </p>

            </div>

          )}

          {result && (

            <>
              <div className="bg-blue-50 rounded-xl p-5 mb-6">

                <h3 className="text-xl font-bold">
                  Recognition Summary
                </h3>

                <p className="mt-2">
                  Total Faces :
                  <strong> {result.total_faces ?? 0}</strong>
                </p>

                <p>
                  Verified :
                  <strong> {result.verified_faces ?? 0}</strong>
                </p>

              </div>
                            {result?.faces?.length > 0 && (

                <div className="space-y-5">

                  {result.faces.map((face, index) => (

                    <div
                      key={index}
                      className={`rounded-xl p-5 border-2 shadow ${
                        face.verified
                          ? "bg-green-50 border-green-500"
                          : "bg-red-50 border-red-500"
                      }`}
                    >

                      {face.verified ? (

                        <>

                          <h3 className="text-2xl font-bold text-green-700">
                            ✅ {face.user.full_name}
                          </h3>

                          <div className="grid grid-cols-2 gap-3 mt-4">

                            <p>
                              <strong>Employee ID</strong>
                              <br />
                              {face.user.employee_id}
                            </p>

                            <p>
                              <strong>Department</strong>
                              <br />
                              {face.user.department}
                            </p>

                            <p>
                              <strong>Email</strong>
                              <br />
                              {face.user.email}
                            </p>

                            <p>
                              <strong>Phone</strong>
                              <br />
                              {face.user.phone}
                            </p>

                            <p>
                              <strong>Confidence</strong>
                              <br />
                              {face.confidence}%
                            </p>

                            <p>
                              <strong>Matched Pose</strong>
                              <br />
                              {face.matched_pose}
                            </p>

                          </div>

                        </>

                      ) : (

                        <>

                          <h3 className="text-2xl font-bold text-red-700">
  ❌ {face.message || "Unknown Person"}
</h3>

                          <p className="mt-3">
                            Confidence :
                            <strong> {face.confidence}%</strong>
                          </p>

                        </>

                      )}

                    </div>

                  ))}

                </div>

              )}

              <button
                onClick={resetVerification}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Reset Verification
              </button>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default VerifyFace;