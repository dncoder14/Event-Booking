import { Response } from 'express';
import { BookingService } from '../services/BookingService';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
  constructor(private bookingService: BookingService) {}

  lockSeats = async (req: AuthRequest, res: Response) => {
    try {
      const { eventId, seatIds } = req.body;
      const result = await this.bookingService.lockSeats(eventId, seatIds, req.user!.id);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(409).json({ message: e.message });
    }
  };

  processPayment = async (req: AuthRequest, res: Response) => {
    try {
      const { paymentMethod } = req.body;
      const result = await this.bookingService.processPayment(req.params['id'] as string, paymentMethod);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  getBookingById = async (req: AuthRequest, res: Response) => {
    try {
      const booking = await this.bookingService.getBookingById(req.params['id'] as string, req.user!.id);
      res.json(booking);
    } catch (e: any) {
      res.status(404).json({ message: e.message });
    }
  };

  getBookingHistory = async (req: AuthRequest, res: Response) => {
    const bookings = await this.bookingService.getUserBookings(req.user!.id);
    res.json(bookings);
  };

  getAllBookings = async (req: AuthRequest, res: Response) => {
    const bookings = await this.bookingService.getAllBookings();
    res.json(bookings);
  };

  cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
      await this.bookingService.cancelBooking(req.params['id'] as string, req.user!.id);
      res.json({ message: 'Booking cancelled' });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };
}
