# Event Ticket Booking System

A premium, full-stack event booking platform designed with a robust modular architecture and modern web aesthetics.

## 🚀 Deployment

The application is architected for cloud-native deployment:
- **Frontend**: Deployed on **Vercel** ([Live Demo](https://event-booking-frontend-three.vercel.app))
- **Backend**: Deployed on **Render** (Express.js)
- **Database**: **Neon** (Serverless PostgreSQL)

## 🛠️ Tech Stack

### Core
- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM

### UI/UX
- **Styling**: Tailwind CSS v4 (Glassmorphism, Neon aesthetics)
- **Icons**: Google Material Symbols
- **Typography**: Plus Jakarta Sans & Inter

## 🏗️ Architecture & OOP Principles

This project follows strict software engineering practices and clean code principles:

- **Inheritance**: Implemented via a generic `BaseRepository<T>` providing common CRUD operations and utilities.
- **Abstraction**: Services are defined through explicit interfaces (`IAuthService`, `IEventService`, etc.), decoupling business logic from implementation.
- **Polymorphism**: Interface-based service injection allows for easy substitution of modules (e.g., swapping payment providers).
- **Design Patterns**: 
  - **Repository Pattern**: Clean data access layer.
  - **Service Layer Pattern**: Separation of concerns.
  - **Facade Pattern**: `BookingService` orchestrates complex interactions between seats, payments, and tickets.
  - **Strategy Pattern**: Flexible payment and QR generation modules.

## ⚙️ Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (Local or Cloud)

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run build
npm start
```

Update `backend/.env`:
```env
DATABASE_URL="your_db_url"
JWT_SECRET="your_secret"
PORT=5001
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run preview
```

## 📋 Key Features
- **Real-time Seat Locking**: Seats are reserved for 10 minutes during checkout; expired locks are auto-released.
- **Concurrency Protection**: Atomic database updates prevent double-booking.
- **Admin Dashboard**: Comprehensive event management and booking analytics.
- **Dynamic Tickets**: Instant QR code generation for venue scanning.
- **Responsive Design**: Fluid layouts optimized for both mobile and desktop.
