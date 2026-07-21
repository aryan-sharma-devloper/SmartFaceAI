import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import api from "../api/axios";

function EnrollFace() {
  const webcamRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const poses = [
    "front",
    "left",
    "right",
    "up",
    "down",
  ];

  const instructions = {
    front: "😊 Look Straight",
    left: "⬅ Turn your head LEFT",
    right: "➡ Turn your head RIGHT",
    up: "⬆ Look UP",
    down: "⬇ Look DOWN",
  };

  const [loading, setLoading] = useState(false);

  const [currentPose, setCurrentPose] = useState(0);

  async function captureFace() {

    setLoading(true);

    try {

      const imageSrc =
        webcamRef.current?.getScreenshot();

      if (!imageSrc) {
        toast.error("Unable to capture image.");
        return;
      }

      const blob = await fetch(imageSrc)
        .then((res) => res.blob());

      const formData = new FormData();

      formData.append(
        "image",
        blob,
        "face.jpg"
      );

      const token =
        localStorage.getItem("token");

      const response = await api.post(

        `/faces/enroll/${id}/${poses[currentPose]}`,

        formData,

        {

          headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

      toast.success(response.data.message);

      if (currentPose < poses.length - 1) {

        setCurrentPose(currentPose + 1);

      } else {

        toast.success(
          "🎉 All 5 face poses enrolled!"
        );

        setTimeout(() => {

          navigate("/users");

        }, 1200);

      }

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Enrollment Failed"
      );

    } finally {

      setLoading(false);

    }

  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-8">

    <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

      {/* LEFT PANEL */}

      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white p-10 flex flex-col">

        <h1 className="text-4xl font-bold">
          Multi-Pose Face Enrollment
        </h1>

        <p className="mt-4 text-blue-100">
          Capture all five face angles for maximum recognition accuracy.
        </p>

        {/* Progress */}

        <div className="mt-10">

          <h2 className="text-xl font-bold mb-5">
            Enrollment Progress
          </h2>

          <div className="space-y-4">

            {poses.map((pose, index) => (

              <div
                key={pose}
                className="flex items-center justify-between bg-white/10 rounded-xl px-5 py-3"
              >

                <span className="capitalize text-lg">
                  {pose}
                </span>

                {index < currentPose ? (

                  <span className="text-green-300 text-2xl">
                    ✅
                  </span>

                ) : index === currentPose ? (

                  <span className="text-yellow-300 font-bold">
                    CURRENT
                  </span>

                ) : (

                  <span className="text-gray-300">
                    ⬜
                  </span>

                )}

              </div>

            ))}

          </div>

        </div>

        {/* Instruction */}

        <div className="mt-12 bg-white/10 rounded-2xl p-6">

          <h3 className="font-bold text-xl">
            Current Pose
          </h3>

          <p className="mt-4 text-2xl font-semibold">

            {instructions[poses[currentPose]]}

          </p>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="p-10 flex flex-col items-center">

        <h2 className="text-3xl font-bold text-slate-800">
          Live Camera
        </h2>

        <p className="text-gray-500 mt-2">
          Follow the instruction on the left.
        </p>

        <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-600">

          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            screenshotFormat="image/jpeg"
            width={700}
            height={500}
            className="rounded-2xl"
            videoConstraints={{
              width: 700,
              height: 500,
              facingMode: "user",
            }}
          />

        </div>

        {/* Current Pose Badge */}

        <div className="mt-6 bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-bold text-lg">

          {poses[currentPose].toUpperCase()}

        </div>

        {/* Capture */}

        <button
          onClick={captureFace}
          disabled={loading}
          className="mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-10 py-4 rounded-2xl shadow-xl min-w-[250px] flex justify-center items-center"
        >

          {loading ? (

            <ClipLoader
              size={24}
              color="#ffffff"
            />

          ) : (

            `📷 Capture ${poses[currentPose].toUpperCase()}`

          )}

        </button>

        {/* Back */}

        <button
          onClick={() => navigate("/users")}
          disabled={loading}
          className="mt-5 bg-gray-700 hover:bg-gray-800 text-white px-10 py-4 rounded-2xl shadow-xl"
        >
          ← Back
        </button>

      </div>

    </div>

  </div>
);
}

export default EnrollFace;