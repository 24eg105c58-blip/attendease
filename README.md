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

### Backend + MySQL
1. Set environment variables `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
2. Deploy the backend to a Java hosting service or a VPS with Java 17 and Docker support.
3. Provision a managed MySQL database or run `docker compose up -d mysql backend`.
4. Set the frontend `VITE_API_URL` to the deployed backend API base URL (for example, `https://your-api-domain.com/api`) before building.

### Frontend
Run `npm run build` inside `frontend`; deploy the generated `dist/` folder to a static host (e.g. Netlify, Vercel, or Nginx). Configure `VITE_API_URL` to your backend URL.

### Important before real deployment
- Replace demo authentication with Spring Security + JWT and BCrypt password hashing.
- Add authorization checks on every endpoint, validate inputs, enable HTTPS, and configure CORS for the deployed frontend origin.
- Use secrets/environment variables; never commit production credentials.
