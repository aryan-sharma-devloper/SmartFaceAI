import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt,
  FaUserPlus,
  FaClipboardList,
} from "react-icons/fa";

import { ClipLoader } from "react-spinners";

import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Charts from "../components/Charts";

function Dashboard() {
  const navigate = useNavigate();

  const [range, setRange] = useState("7");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const [time, setTime] = useState(new Date());

  const [stats, setStats] = useState({
    users: 0,
    faces: 0,
    verified_today: 0,
    failed_today: 0,

    weekly: [],
    monthly: [],

    pie: {
      verified: 0,
      failed: 0,
    },

    recent_users: [],
    recent_logs: [],
  });

  const hour = time.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [range]);

  async function fetchDashboard(showLoader = true) {
    try {
      if (showLoader) setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        `/dashboard/stats?days=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);

     setLastUpdated(
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="flex flex-col items-center gap-5">
          <ClipLoader
            color="#2563eb"
            size={70}
          />

          <p className="text-lg text-gray-500">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }
  
  return (
   <div className="min-h-screen bg-slate-100 flex">

      <Sidebar />

      <main className="flex-1 lg:ml-72 p-8">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Smart Face Identity Verification System
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Last Updated : {lastUpdated}
            </p>

          </div>

          <button
            onClick={() => fetchDashboard()}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            <FaSyncAlt />

            Refresh Dashboard

          </button>

        </div>

        {/* Hero */}

        <section className="mt-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-10 shadow-2xl">

          <div className="flex flex-col lg:flex-row justify-between items-center">

            <div>

              <h2 className="text-4xl font-bold">
                👋 {greeting}, Admin
              </h2>

              <p className="mt-4 text-blue-100 text-lg">
                Monitor your Smart Face AI platform in real time.
              </p>

              <p className="opacity-90 mt-2">
                Manage employees, verify identities,
                and monitor analytics from one dashboard.
              </p>

            </div>

            <div className="text-right mt-8 lg:mt-0">

              <h2 className="text-5xl font-bold">

                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}

              </h2>

              <p className="mt-2 text-blue-100">

                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}

              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">

            <div className="bg-white/15 backdrop-blur rounded-2xl p-6">

              <p>Total Employees</p>

              <h3 className="text-5xl font-bold mt-2">
                {stats.users}
              </h3>

            </div>

           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
              <p>Today's Verified</p>

              <h3 className="text-5xl font-bold mt-2">
                {stats.verified_today}
              </h3>

            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">

              <p>Failed Today</p>

              <h3 className="text-5xl font-bold mt-2">
                {stats.failed_today}
              </h3>

            </div>

          </div>

        </section>
        {/* ==========================
    AI Overview
========================== */}

<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
    <p className="text-gray-500 text-sm">AI Recognition Accuracy</p>

    <h2 className="text-4xl font-bold text-green-600 mt-2">
      99.84%
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      ArcFace Recognition Model
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
    <p className="text-gray-500 text-sm">System Status</p>

    <div className="flex items-center gap-3 mt-3">
      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>

      <span className="font-bold text-green-600">
        Online
      </span>
    </div>

    <p className="text-xs text-gray-400 mt-2">
      All Services Running
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
    <p className="text-gray-500 text-sm">Today's Requests</p>

    <h2 className="text-4xl font-bold mt-2">
      {stats.verified_today + stats.failed_today}
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      Verification Requests
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
    <p className="text-gray-500 text-sm">Success Rate</p>

    <h2 className="text-4xl font-bold text-blue-600 mt-2">
      {stats.verified_today + stats.failed_today === 0
        ? "0%"
        : (
            (stats.verified_today /
              (stats.verified_today + stats.failed_today)) *
            100
          ).toFixed(1) + "%"}
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      Verification Accuracy
    </p>
  </div>

</section>
{/* ==========================
    Dashboard Summary
========================== */}

<section className="mt-8 bg-white rounded-3xl shadow-xl p-6">

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

    <div>
      <h3 className="text-3xl font-bold text-blue-600">
        {stats.users}
      </h3>
      <p className="text-gray-500 mt-2">Registered Users</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-green-600">
        {stats.faces}
      </h3>
      <p className="text-gray-500 mt-2">Face Embeddings</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-purple-600">
        {stats.verified_today}
      </h3>
      <p className="text-gray-500 mt-2">Verified Today</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-red-600">
        {stats.failed_today}
      </h3>
      <p className="text-gray-500 mt-2">Failed Attempts</p>
    </div>

  </div>

</section>
        {/* ==========================
    System Status
========================== */}

<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">AI Accuracy</p>
        <h2 className="text-3xl font-bold text-green-600">
          99.84%
        </h2>
      </div>

      <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">Recognition Engine</p>
        <h2 className="text-2xl font-bold text-blue-600">
          Online
        </h2>
      </div>

      <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <div>
      <p className="text-gray-500">Today's Activity</p>
      <h2 className="text-3xl font-bold">
        {stats.verified_today + stats.failed_today}
      </h2>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <div>
      <p className="text-gray-500">Success Rate</p>

      <h2 className="text-3xl font-bold text-green-600">
        {stats.verified_today + stats.failed_today === 0
          ? "0%"
          : (
              (stats.verified_today /
                (stats.verified_today + stats.failed_today)) *
              100
            ).toFixed(1) + "%"}
      </h2>
    </div>
  </div>

</section>
                {/* ==========================
            Quick Actions
        ========================== */}

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

          <button
            onClick={() => navigate("/add-user")}
            className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-7"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FaUserPlus className="text-3xl text-blue-600 group-hover:scale-110 transition" />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Add User
            </h3>

            <p className="text-gray-500 mt-2">
              Register a new employee.
            </p>
          </button>

          <button
            onClick={() => navigate("/users")}
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-7"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
              <FaUsers className="text-3xl text-green-600 group-hover:scale-110 transition" />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Manage Users
            </h3>

            <p className="text-gray-500 mt-2">
              View and manage employees.
            </p>
          </button>

          <button
            onClick={() => navigate("/verify")}
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-7"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
              <FaCamera className="text-3xl text-purple-600 group-hover:scale-110 transition" />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Verify Face
            </h3>

            <p className="text-gray-500 mt-2">
              Start live face verification.
            </p>
          </button>

          <button
            onClick={() => navigate("/logs")}
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-7"
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
              <FaClipboardList className="text-3xl text-orange-600 group-hover:scale-110 transition" />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Reports
            </h3>

            <p className="text-gray-500 mt-2">
              View verification history.
            </p>
          </button>

        </section>

        {/* ==========================
            Filter Buttons
        ========================== */}

        <section className="flex flex-wrap gap-4 mt-10">

          {[
            { label: "Today", value: "1" },
            { label: "Last 7 Days", value: "7" },
            { label: "Last 30 Days", value: "30" },
          ].map((item) => (

            <button
              key={item.value}
              onClick={() => setRange(item.value)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                range === item.value
                  ? "bg-blue-600 text-white shadow-xl"
                  : "bg-white text-slate-700 hover:bg-blue-50 shadow-md"
              }`}
            >
              {item.label}
            </button>

          ))}

        </section>

        {/* ==========================
            Statistics Cards
        ========================== */}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mt-10">

          <StatCard
            title="Total Users"
            value={stats.users}
            color="bg-gradient-to-r from-blue-600 to-blue-700"
            icon={<FaUsers />}
          />

          <StatCard
            title="Face Embeddings"
            value={stats.faces}
            color="bg-gradient-to-r from-green-600 to-green-700"
            icon={<FaCamera />}
          />

          <StatCard
            title="Verified Today"
            value={stats.verified_today}
            color="bg-gradient-to-r from-purple-600 to-purple-700"
            icon={<FaCheckCircle />}
          />

          <StatCard
            title="Failed Today"
            value={stats.failed_today}
            color="bg-gradient-to-r from-red-600 to-red-700"
            icon={<FaTimesCircle />}
          />

        </section>
        {/* ==========================
    Analytics
========================== */}

<section className="grid lg:grid-cols-3 gap-8 mt-10">

  <div className="bg-white rounded-3xl shadow-xl p-7">

    <h2 className="text-xl font-bold text-slate-800">
      Verification Accuracy
    </h2>

    <div className="mt-8 flex justify-center">

      <div className="relative w-44 h-44">

        <div className="absolute inset-0 rounded-full border-[16px] border-gray-200"></div>

        <div
          className="absolute inset-0 rounded-full border-[16px] border-green-500 border-t-transparent rotate-45"
        ></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center">

          <h2 className="text-5xl font-bold text-green-600">
            99%
          </h2>

          <p className="text-gray-500">
            Accuracy
          </p>

        </div>

      </div>

    </div>

  </div>

  <div className="bg-white rounded-3xl shadow-xl p-7">

    <h2 className="text-xl font-bold mb-8">
      Today's Statistics
    </h2>

    <div className="space-y-6">

      <div>

        <div className="flex justify-between">
          <span>Verified</span>
          <span>{stats.verified_today}</span>
        </div>

        <div className="h-3 bg-gray-200 rounded-full mt-2">
          <div className="bg-green-500 h-3 rounded-full w-[85%]"></div>
        </div>

      </div>

      <div>

        <div className="flex justify-between">
          <span>Failed</span>
          <span>{stats.failed_today}</span>
        </div>

        <div className="h-3 bg-gray-200 rounded-full mt-2">
          <div className="bg-red-500 h-3 rounded-full w-[15%]"></div>
        </div>

      </div>

    </div>

  </div>

  <div className="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-3xl shadow-xl p-7 text-white">

    <h2 className="text-2xl font-bold">
      AI Engine
    </h2>

    <div className="mt-8 space-y-5">

      <div className="flex justify-between">
        <span>Recognition</span>
        <strong>ArcFace</strong>
      </div>

      <div className="flex justify-between">
        <span>Embedding</span>
        <strong>512-D</strong>
      </div>

      <div className="flex justify-between">
        <span>Database</span>
        <strong>pgvector</strong>
      </div>

      <div className="flex justify-between">
        <span>Framework</span>
        <strong>FastAPI</strong>
      </div>

      <div className="flex justify-between">
        <span>Status</span>
        <strong className="text-green-300">
          Online
        </strong>
      </div>

    </div>

  </div>

</section>
{/* ==========================
    Camera Status
========================== */}

<section className="grid md:grid-cols-4 gap-6 mt-10">

  {[
    "Entrance Gate",
    "Reception",
    "Server Room",
    "Office Floor"
  ].map((camera) => (

    <div
      key={camera}
      className="bg-white rounded-3xl shadow-lg p-6"
    >

      <div className="flex justify-between items-center">

        <h2 className="font-bold">
          {camera}
        </h2>

        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>

      </div>

      <p className="text-gray-500 mt-4">
        Camera Online
      </p>

    </div>

  ))}

</section>
{/* ==========================
    AI System Status
========================== */}

<section className="grid lg:grid-cols-4 gap-6 mt-10">

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <p className="text-gray-500">AI Model</p>
    <h2 className="text-2xl font-bold text-blue-600 mt-3">
      ArcFace
    </h2>
    <p className="text-green-500 mt-4">
      ● Running
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <p className="text-gray-500">Backend</p>
    <h2 className="text-2xl font-bold text-green-600 mt-3">
      FastAPI
    </h2>
    <p className="text-green-500 mt-4">
      ● Connected
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <p className="text-gray-500">Database</p>
    <h2 className="text-2xl font-bold text-purple-600 mt-3">
      PostgreSQL
    </h2>
    <p className="text-green-500 mt-4">
      ● Healthy
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6">
    <p className="text-gray-500">Embedding Size</p>
    <h2 className="text-2xl font-bold text-orange-600 mt-3">
      512-D
    </h2>
    <p className="text-gray-500 mt-4">
      Vector Database
    </p>
  </div>

</section>
        {/* ==========================
    Performance
========================== */}

<section className="grid md:grid-cols-2 gap-8 mt-10">

  <div className="bg-white rounded-3xl shadow-xl p-7">

    <h2 className="text-xl font-bold">
      Verification Progress
    </h2>

    <div className="mt-6">

      <div className="flex justify-between">
        <span>Verified</span>
        <span>{stats.verified_today}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{
            width: `${stats.verified_today + stats.failed_today === 0
              ? 0
              : (stats.verified_today /
                  (stats.verified_today + stats.failed_today)) *
                100
            }%`,
          }}
        ></div>
      </div>

    </div>

    <div className="mt-6">

      <div className="flex justify-between">
        <span>Failed</span>
        <span>{stats.failed_today}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
        <div
          className="bg-red-500 h-3 rounded-full"
          style={{
            width: `${stats.verified_today + stats.failed_today === 0
              ? 0
              : (stats.failed_today /
                  (stats.verified_today + stats.failed_today)) *
                100
            }%`,
          }}
        ></div>
      </div>

    </div>

  </div>

  <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl shadow-xl p-8 text-white">

    <h2 className="text-2xl font-bold">
      AI Engine
    </h2>

    <p className="mt-3 opacity-90">
      ArcFace + InsightFace
    </p>

    <div className="mt-8 space-y-4">

      <div className="flex justify-between">
        <span>Embedding Model</span>
        <strong>512-D</strong>
      </div>

      <div className="flex justify-between">
        <span>Inference</span>
        <strong>GPU Ready</strong>
      </div>

      <div className="flex justify-between">
        <span>Matching Speed</span>
        <strong>&lt;150 ms</strong>
      </div>

      <div className="flex justify-between">
        <span>Database</span>
        <strong>PostgreSQL + pgvector</strong>
      </div>

    </div>

  </div>

</section>
{/* ==========================
    Live System Monitor
========================== */}

<section className="grid lg:grid-cols-4 gap-6 mt-10">

  <div className="bg-white rounded-3xl shadow-xl p-6">
    <p className="text-gray-500">CPU Usage</p>

    <h2 className="text-4xl font-bold mt-3 text-blue-600">
      28%
    </h2>

    <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
      <div className="bg-blue-600 h-3 rounded-full w-[28%]"></div>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-xl p-6">
    <p className="text-gray-500">Memory</p>

    <h2 className="text-4xl font-bold mt-3 text-green-600">
      61%
    </h2>

    <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
      <div className="bg-green-500 h-3 rounded-full w-[61%]"></div>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-xl p-6">
    <p className="text-gray-500">Database</p>

    <h2 className="text-4xl font-bold mt-3 text-purple-600">
      Healthy
    </h2>

    <div className="flex items-center mt-4">
      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

      <span className="ml-3 font-semibold">
        PostgreSQL Connected
      </span>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-xl p-6">
    <p className="text-gray-500">API Server</p>

    <h2 className="text-4xl font-bold mt-3 text-green-600">
      Online
    </h2>

    <div className="flex items-center mt-4">
      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

      <span className="ml-3 font-semibold">
        FastAPI Running
      </span>
    </div>
  </div>

</section>

        {/* ==========================
            Charts
        ========================== */}

        <section className="mt-12">

          <Charts
            weekly={stats.weekly}
            monthly={stats.monthly}
            pie={stats.pie}
          />

        </section> 
                {/* ==========================
            Bottom Tables
        ========================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">
        {/* ==========================
    Live Activity
========================== */}

<section className="mt-10 bg-white rounded-3xl shadow-xl p-6">

  <h2 className="text-2xl font-bold text-slate-800 mb-6">
    Live Activity
  </h2>

  <div className="space-y-4">

    <div className="flex justify-between border-l-4 border-green-500 pl-4">
      <div>
        <p className="font-semibold">
          Face Verification Completed
        </p>

        <p className="text-sm text-gray-500">
          Recognition successful
        </p>
      </div>

      <span className="text-gray-400">
        Just now
      </span>
    </div>

    <div className="flex justify-between border-l-4 border-blue-500 pl-4">
      <div>
        <p className="font-semibold">
          New Employee Registered
        </p>

        <p className="text-sm text-gray-500">
          Face embeddings generated
        </p>
      </div>

      <span className="text-gray-400">
        5 mins ago
      </span>
    </div>

    <div className="flex justify-between border-l-4 border-red-500 pl-4">
      <div>
        <p className="font-semibold">
          Verification Failed
        </p>

        <p className="text-sm text-gray-500">
          Confidence below threshold
        </p>
      </div>

      <span className="text-gray-400">
        10 mins ago
      </span>
    </div>

  </div>

</section>
          {/* ==========================
              Recent Users
          ========================== */}

          <div className="bg-white rounded-3xl shadow-xl p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-slate-800">
                Recent Users
              </h2>

              <button
                onClick={() => navigate("/users")}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                View All →
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b text-gray-500">

                    <th className="text-left py-3">Employee</th>

                    <th className="text-left">Department</th>

                    <th className="text-left">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {stats.recent_users.length > 0 ? (

                    stats.recent_users.map((user, index) => (

                      <tr
                        key={index}
                        className="border-b hover:bg-blue-50 transition duration-300"
                      >

                        <td className="py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                              {user.full_name?.charAt(0).toUpperCase()}

                            </div>

                            <div>

                              <p className="font-semibold">

                                {user.full_name}

                              </p>

                              <p className="text-sm text-gray-500">

                                {user.employee_id}

                              </p>

                            </div>

                          </div>

                        </td>

                        <td>

                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">

                            {user.department}

                          </span>

                        </td>

                        <td>

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                            Active

                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="3">

<div className="py-14 text-center">

  <FaUsers className="mx-auto text-6xl text-gray-300"/>

  <h3 className="mt-4 text-xl font-semibold text-gray-600">
      No Users Available
  </h3>

  <p className="text-gray-400 mt-2">
      Add a new employee to start using the system.
  </p>

</div>

</td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ==========================
              Recent Verification Logs
          ========================== */}

          <div className="bg-white rounded-3xl shadow-xl p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-slate-800">

                Recent Verification Logs

              </h2>

              <button
                onClick={() => navigate("/logs")}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                View All →
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b text-gray-500">

                    <th className="text-left py-3">

                      User ID

                    </th>

                    <th className="text-left">

                      Status

                    </th>

                    <th className="text-left">

                      Confidence

                    </th>

                    <th className="text-left">

                      Time

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {stats.recent_logs.length > 0 ? (

                    stats.recent_logs.map((log, index) => (

                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition duration-300"
                      >

                        <td className="py-4">
  <div className="flex items-center gap-3">

    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
      {log.full_name?.charAt(0).toUpperCase()}
    </div>

    <div>
      <p className="font-semibold">
        {log.full_name}
      </p>

      <p className="text-xs text-gray-500">
        {log.employee_id}
      </p>
    </div>

  </div>
</td>

                        <td>

                          <span
                            className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                              log.status === "verified"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >

                            {log.status}

                          </span>

                        </td>

                        <td>

                          {log.confidence
                            ? `${Number(log.confidence).toFixed(2)} %`
                            : "-"}

                        </td>

                        <td>

                          {log.created_at
                            ? new Date(log.created_at).toLocaleString()
                            : "-"}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                     <td colSpan="4">

<div className="py-14 text-center">

  <FaClipboardList className="mx-auto text-6xl text-gray-300"/>

  <h3 className="mt-4 text-xl font-semibold text-gray-600">
      No Verification Logs
  </h3>

  <p className="text-gray-400 mt-2">
      Verification history will appear here.
  </p>

</div>

</td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
     <footer className="mt-16 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 shadow-2xl">

  <div className="flex flex-col lg:flex-row justify-between items-center">

    <div>

      <h2 className="text-2xl font-bold">
        Smart Face Identity Verification System
      </h2>

      <p className="text-gray-300 mt-2">
        AI Powered Face Recognition Dashboard
      </p>

    </div>

    <div className="mt-6 lg:mt-0 text-right">

      <h3 className="font-semibold">
        Version 1.0
      </h3>

      <p className="text-gray-400">
        React • FastAPI • PostgreSQL • ArcFace
      </p>

      <p className="text-gray-500 mt-2">
        © 2026 All Rights Reserved
      </p>

    </div>

  </div>

</footer>
      </main>

    </div>

  );

}

export default Dashboard;