# 🚀 SmartFaceAI – AI Powered Face Identity Verification System

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

# 📌 Overview

SmartFaceAI is an AI-powered biometric authentication and attendance management system that verifies users using facial recognition.

The system uses ArcFace embeddings, FastAPI, React, PostgreSQL, and modern web technologies to provide secure, contactless identity verification and attendance tracking.

---

# ✨ Features

## 👤 User Management

- Add Users
- Edit Users
- Delete Users
- Search Users
- Face Enrollment

---

## 🤖 Face Recognition

- AI Face Verification
- Live Camera Verification
- ArcFace Embeddings
- Multi-angle Face Support
- Face Similarity Matching

---

## 🕒 Attendance Management

- Automatic Check-In
- Automatic Check-Out
- Working Hours Calculation
- Daily Attendance Logs
- Live Attendance Dashboard

---

## 📊 Dashboard

- Employee Statistics
- Present Today
- Checked Out
- Attendance Records
- Verification Logs

---

## 🔐 Authentication

- JWT Authentication
- Secure Login
- Protected Routes
- Admin Management

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router
- Axios
- Tailwind CSS

---

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- JWT Authentication
- Pydantic

---

## AI

- InsightFace
- ArcFace
- ONNX Runtime
- OpenCV

---

## Database

- PostgreSQL
- pgvector

---

# 📁 Project Structure

```
SmartFaceAI
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── auth
│   │   ├── crud
│   │   ├── database
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/aryan-sharma-developer/SmartFaceAI.git

cd SmartFaceAI
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend URL

```
http://localhost:8000
```

Swagger Docs

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env`

```
DATABASE_URL=your_database_url

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

FACE_SIMILARITY_THRESHOLD=0.60
```

---

# Database

Uses PostgreSQL with pgvector extension.

Run migrations

```bash
alembic upgrade head
```

---

# API Features

## Authentication

- Login
- JWT Token

## Users

- Create User
- Update User
- Delete User
- List Users

## Face

- Enroll Face
- Verify Face
- Live Verification

## Attendance

- Check-In
- Check-Out
- Attendance Logs
- Dashboard Statistics

---

# Screenshots

## Login

<img width="671" height="356" alt="image" src="https://github.com/user-attachments/assets/44f6e077-b197-45fc-96b0-e037b323c4b9" />



---

## Dashboard

<img width="928" height="480" alt="image" src="https://github.com/user-attachments/assets/779aa6e3-8dc9-404b-9d10-3accb30386d9" />


---

## Users

<img width="929" height="478" alt="image" src="https://github.com/user-attachments/assets/336d408b-44b6-4320-9628-c710f1f615c2" />


---

## Attendance

<img width="923" height="474" alt="image" src="https://github.com/user-attachments/assets/86b5a49a-4fde-483c-b530-5cbe77404b44" />


---

## Live Verification

<img width="924" height="501" alt="image" src="https://github.com/user-attachments/assets/219ac4b8-811f-40fe-8730-f1d673c5821e" />


---

# Future Improvements

- Email Notifications
- Face Anti-Spoofing
- Multiple Camera Support
- Excel Export
- PDF Reports
- Mobile Application
- Docker Deployment
- Cloud Deployment
- Employee Self-Service Portal
- Leave Management
- Payroll Integration

---

# Author

**Aryan Sharma**

GitHub

https://github.com/aryan-sharma-developer

---

# License

This project is licensed under the MIT License.

---

⭐ If you like this project, don't forget to Star the repository.
