import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import bookingRoutes from './routes/bookings';
import uploadRoutes from './routes/upload';
import { SeatRepository } from './repositories/SeatRepository';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';

const app = express();

// Manual CORS headers to ensure preflight works with Express 5
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// Release expired seat locks every minute
const seatRepo = new SeatRepository();
setInterval(() => seatRepo.releaseExpiredLocks(), 60 * 1000);

// Must be registered AFTER all routes
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
