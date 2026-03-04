import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { BookingService } from '../services/BookingService';
import { BookingRepository } from '../repositories/BookingRepository';
import { SeatService } from '../services/SeatService';
import { SeatRepository } from '../repositories/SeatRepository';
import { PaymentService } from '../services/PaymentService';
import { TicketService } from '../services/TicketService';
import { TicketRepository } from '../repositories/TicketRepository';
import { EventRepository } from '../repositories/EventRepository';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

const seatRepo = new SeatRepository();
const seatService = new SeatService(seatRepo);
const bookingService = new BookingService(
  new BookingRepository(),
  seatService,
  new PaymentService(),
  new TicketService(new TicketRepository()),
  new EventRepository()
);
const controller = new BookingController(bookingService);

router.use(authenticate);
router.post('/lock-seats', controller.lockSeats);
router.post('/:id/payment', controller.processPayment);
router.get('/my', controller.getBookingHistory);
router.get('/all', requireAdmin, controller.getAllBookings);
router.get('/:id', controller.getBookingById);
router.delete('/:id', controller.cancelBooking);

export default router;
