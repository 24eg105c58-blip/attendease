# AttendEase — Smart Attendance Monitoring System

A starter full-stack attendance system based on your project brief: React frontend, Java Spring Boot REST backend, and MySQL database.

## Features included
- Role-based login-ready user model (ADMIN, FACULTY, STUDENT)
- Admin can create/list users, subjects, and attendance records via REST endpoints
- Faculty can mark attendance
- Students can view their own attendance summary
- Attendance percentage calculation and shortage status
- React dashboard UI with demo navigation
- Docker Compose for MySQL + backend; frontend can run locally or be deployed separately

> This is an educational starter project, not a production-ready security deployment. The login endpoint uses demo credentials and should be replaced with Spring Security/JWT and password hashing before real use.

## Requirements
- Java 17+
- Maven 3.9+
- Node.js 20+
- Docker Desktop (optional, for MySQL)

## Quick start

### 1. Start MySQL
From the project root:
```bash
docker compose up -d mysql
```
Or create a MySQL database named `attendease` and update `backend/src/main/resources/application.properties`.

### 2. Run backend
```bash
cd backend
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api`

### 3. Run frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## API endpoints
- `GET /api/health`
- `POST /api/auth/login` — demo login body: `{"email":"admin@attendease.com","password":"admin123"}`
- `GET /api/users` / `POST /api/users`
- `GET /api/subjects` / `POST /api/subjects`
- `GET /api/attendance?studentId=1`
- `POST /api/attendance` — mark attendance
- `GET /api/attendance/summary?studentId=1`

The sample app initializes demo users and subjects on startup. Use the included sample IDs in the UI.

## Deployment

The app can be deployed as a Render Docker web service and managed PostgreSQL database, plus a Vercel static site for the frontend. The local setup continues to use MySQL by default.

### 1. Deploy the backend on Render
1. In the [Render Dashboard](https://dashboard.render.com), choose **New + → Blueprint**, connect this GitHub repository, and select `render.yaml`.
2. Deploy the Blueprint to create the API service and PostgreSQL database. The Blueprint wires the database connection automatically.
3. Wait for the service health check to pass, then copy its URL, such as `https://attendease-api.onrender.com`.

### 2. Deploy the frontend on Vercel
1. In the [Vercel Dashboard](https://vercel.com/dashboard), import this GitHub repository.
2. Set **Root Directory** to `frontend` and keep the detected Vite build settings (`npm run build`, output directory `dist`).
3. The production frontend defaults to the AttendEase Render API. If you use a different backend URL, add `VITE_API_URL` with the backend URL and `/api` (for example `https://your-api-domain.onrender.com/api`) for Production (and Preview if needed), then deploy.
4. `CORS_ALLOWED_ORIGINS` in `render.yaml` includes the Vercel main-branch domain and local development origins. If you add a custom Vercel domain, add that exact origin (no trailing slash) to this variable.

The Render service uses the health endpoint `/api/health`. Both platforms can deploy future changes from the connected GitHub repository. Keep database credentials in Render environment variables; never commit them.

### Important before real deployment
- Replace demo authentication with Spring Security + JWT and BCrypt password hashing.
- Add authorization checks on every endpoint, validate inputs, enable HTTPS, and configure CORS for the deployed frontend origin.
- Use secrets/environment variables; never commit production credentials.
