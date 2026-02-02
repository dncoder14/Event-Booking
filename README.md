# Event Ticket Booking System

Full-stack web app — Node.js + Express + Prisma (PostgreSQL) backend, React + TypeScript frontend.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend

```bash
cd backend
npm install
```

Update `.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/eventbooking"
JWT_SECRET="your_secret"
PORT=5000
```

Run migrations and start:
```bash
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## Architecture

### Backend — Controller → Service → Repository

| Layer | Responsibility |
|---|---|
| Controller | Handle HTTP request/response |
| Service | Business logic (seat locking, payment, ticket) |
| Repository | Database access via Prisma |
| Model | Domain classes with behaviour |

### Key Features
- **Seat locking** — seats locked for 10 min during checkout, auto-released via interval
- **Concurrency safety** — `updateMany` with `WHERE status = AVAILABLE` prevents double booking
- **Role-based access** — JWT middleware, Admin-only routes
- **QR tickets** — generated with `qrcode` npm package on booking confirmation
- **Simulated payment** — always succeeds, returns a transaction ID

### API Routes

| Method | Route | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/events | Public |
| GET | /api/events/:id | Public |
| GET | /api/events/:id/seats | Public |
| POST | /api/events | Admin |
| PUT | /api/events/:id | Admin |
| DELETE | /api/events/:id | Admin |
| POST | /api/bookings/lock-seats | User |
| POST | /api/bookings/:id/payment | User |
| GET | /api/bookings/my | User |
| DELETE | /api/bookings/:id | User |
| GET | /api/bookings/all | Admin |
