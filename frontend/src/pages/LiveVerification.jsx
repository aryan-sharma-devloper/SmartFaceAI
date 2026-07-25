import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

export default function LiveVerification() {
  const webcamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState(null);

  const startCamera = () => {
    setCameraOn(true);
    setVerified(false);
    setResult(null);
  };

  const stopCamera = () => {
    setCameraOn(false);
    setVerified(false);
    setResult(null);
    setLoading(false);
  };

  const verifyFace = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    setLoading(true);

    try {
      const blob = await fetch(imageSrc).then((r) => r.blob());

      const formData = new FormData();

      formData.append(
        "image",
        blob,
        "capture.jpg"
      );

      const res = await api.post(
        "/faces/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);

      if (res.data.verified_faces > 0) {
        setVerified(true);
      }

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {

    if (!cameraOn || verified) return;

    const interval = setInterval(() => {
      verifyFace();
    }, 2500);

    return () => clearInterval(interval);

  }, [cameraOn, verified]);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          Live Face Verification
        </h1>

        <div className="grid grid-cols-2 gap-8">

          {/* Camera */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Live Camera
            </h2>

           {cameraOn ? (

  <div className="relative">

    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="rounded-xl w-full"
      videoConstraints={{
        width: 1280,
        height: 720,
        facingMode: "user",
      }}
    />

    {/* Face Boxes */}

    {result &&
      result.faces &&
      result.faces.map((face, index) => (

        <div
          key={index}
          className={`absolute border-4 rounded-lg ${
            face.verified
              ? "border-green-500"
              : "border-red-500"
          }`}
          style={{
            left: `${face.face_box.x}px`,
            top: `${face.face_box.y}px`,
            width: `${face.face_box.width}px`,
            height: `${face.face_box.height}px`,
          }}
        >

          <div
            className={`text-white text-xs px-2 py-1 ${
              face.verified
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {face.verified
              ? `${face.user.full_name} (${face.confidence}%)`
              : "Unknown"}
          </div>

        </div>

      ))}

  </div>

) : (

  <div className="h-[420px] flex items-center justify-center bg-gray-200 rounded-xl text-2xl text-gray-500">
    Camera Off
  </div>

)}
            <div className="flex gap-4 mt-6">

              {!cameraOn ? (

                <button
                  onClick={startCamera}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                  Start Camera
                </button>

              ) : (

                <>
                  <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center">
                    {verified
                      ? "Employee Verified"
                      : "Auto Verifying Every 2.5 Seconds"}
                  </div>

                  <button
                    onClick={stopCamera}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
                  >
                    Stop Camera
                  </button>
                </>

              )}

            </div>

          </div>

          {/* Result */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Verification Result
            </h2>

            {loading && (
              <div className="text-blue-600 text-lg font-semibold">
                Verifying...
              </div>
            )}

            {!loading &&
              result &&
              result.faces &&
              result.faces.length > 0 && (

                <div>

                  {result.faces.map((face, index) => (

                    <div
                      key={index}
                      className="border rounded-xl p-6 mb-5 shadow-sm"
                    >

                      <h2
                        className={`text-3xl font-bold ${
                          face.verified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {face.message}
                      </h2>

                      <div className="mt-4">

                        <strong>Confidence :</strong>{" "}
                        {face.confidence}%

                      </div>

                      <div className="mt-2">

                        <strong>Matched Pose :</strong>{" "}
                        {face.matched_pose ?? "-"}

                      </div>

                     {face.user && (

  <>

    <hr className="my-5" />

    <div className="flex gap-6 items-center">

      <img
        src={`http://127.0.0.1:8000/${face.user.profile_photo}`}
        alt="Employee"
        className="w-32 h-32 rounded-xl object-cover border-2 border-blue-500 shadow"
      />

      <div className="space-y-2">

        <h2 className="text-2xl font-bold">
          {face.user.full_name}
        </h2>

        <p>
          <strong>Employee ID :</strong>{" "}
          {face.user.employee_id}
        </p>

        <p>
          <strong>Department :</strong>{" "}
          {face.user.department}
        </p>

        <p>
          <strong>Email :</strong>{" "}
          {face.user.email}
        </p>

        <p>
          <strong>Phone :</strong>{" "}
          {face.user.phone}
        </p>

      </div>

    </div>

  </>

)}

                    </div>

                  ))}

                </div>

              )}

          </div>

        </div>

      </div>

    </div>
  );
}