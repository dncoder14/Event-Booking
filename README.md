# Event Ticket Booking System

A premium, full-stack event booking platform designed with a robust modular architecture and modern web aesthetics.

## Deployment

The application is architected for cloud-native deployment:
- **Frontend**: Deployed on **Vercel** ([Live Demo](https://event-booking-frontend-three.vercel.app))
- **Backend**: Deployed on **Render** (Express.js)
- **Database**: **Neon** (Serverless PostgreSQL)

## Documentation
Detailed technical diagrams and documentation are available:
- [ER Diagram](file:///Users/dhirajpandit/Desktop/Event%20Booking/ErDiagram.md) - Database schema and relationships.
- [Class Diagram](file:///Users/dhirajpandit/Desktop/Event%20Booking/classDiagram.md) - System architecture and OOP design.
- [Sequence Diagram](file:///Users/dhirajpandit/Desktop/Event%20Booking/sequenceDiagram.md) - End-to-end booking flow logic.
- [Use Case Diagram](file:///Users/dhirajpandit/Desktop/Event%20Booking/useCaseDiagram.md) - Actor interactions and system scope.
- [Project Idea](file:///Users/dhirajpandit/Desktop/Event%20Booking/idea.md) - Concept and scope.

## Tech Stack

### Core
- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM

### UI/UX
- **Styling**: **Tailwind CSS v4** (Utilizing the latest `@tailwindcss/vite` plugin, Glassmorphism, Neon aesthetics)
- **Icons**: Google Material Symbols
- **Typography**: Plus Jakarta Sans & Inter
- **State Management**: React Hooks & Context API
- **Routing**: React Router 7

## Architecture & OOP Principles

This project follows strict software engineering practices and clean code principles:

- **Inheritance**: Implemented via a generic `BaseRepository<T>` providing common CRUD operations and utilities.
- **Abstraction**: Services are defined through explicit interfaces (`IAuthService`, `IEventService`, etc.), decoupling business logic from implementation.
- **Polymorphism**: Interface-based service injection allows for easy substitution of modules (e.g., swapping payment providers).
- **Design Patterns**: 
  - **Repository Pattern**: Clean data access layer.
  - **Service Layer Pattern**: Separation of concerns.
  - **Facade Pattern**: `BookingService` orchestrates complex interactions between seats, payments, and tickets.
  - **Strategy Pattern**: Flexible payment and QR generation modules.

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (Local or Cloud)

### Backend Setup

The backend is built with Express.js and follows a Controller-Service-Repository pattern.

```bash
cd backend
npm install
npx prisma generate
npm run build
npm start
```

**Environment Variables (`backend/.env`):**
```env
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
JWT_SECRET="your_secure_jwt_secret"
PORT=5001
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Frontend Setup

The frontend is a high-performance SPA built with Vite and React 19.

```bash
cd frontend
npm install
npm run dev
```

**Note:** Ensure the `VITE_API_URL` (if used) points to your backend instance.

## Key Features
- **Real-time Seat Locking**: Seats are reserved for 10 minutes during checkout; expired locks are auto-released.
- **Concurrency Protection**: Atomic database updates and row-level locking prevent double-booking.
- **Image Uploads**: Integrated with **Cloudinary** for secure event poster storage.
- **Admin Dashboard**: Comprehensive event management and booking analytics.
- **Dynamic Tickets**: Instant QR code generation for venue scanning.
- **Responsive Design**: Fluid layouts optimized for both mobile and desktop.
