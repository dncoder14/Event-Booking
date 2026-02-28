import { BookingRepository } from '../repositories/BookingRepository';
import { SeatService } from './SeatService';
import { PaymentService } from './PaymentService';
import { TicketService } from './TicketService';
import { EventRepository } from '../repositories/EventRepository';
import { IBookingService } from './interfaces';

export class BookingService implements IBookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private seatService: SeatService,
    private paymentService: PaymentService,
    private ticketService: TicketService,
    private eventRepo: EventRepository
  ) {}

  async lockSeats(eventId: string, seatIds: string[], userId: string) {
    await this.seatService.checkAndLock(seatIds, userId);

    const seats = await this.seatService.getSeatsByIds(seatIds) as Array<{ id: string; price: number }>;
    const totalAmount = seats.reduce((sum: number, s: { price: number }) => sum + s.price, 0);

    const booking = await this.bookingRepo.create({
      userId, eventId, totalAmount,
      seatIds: seats.map((s: { id: string; price: number }) => ({ seatId: s.id, priceAtBooking: s.price })),
    });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return { booking, expiresAt };
  }

  async processPayment(bookingId: string, paymentMethod: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'PENDING') throw new Error('Booking is not pending');

    const payment = this.paymentService.processTransaction(booking.totalAmount, paymentMethod);

    const seatIds = booking.bookingSeats.map((bs: { seatId: string }) => bs.seatId);
    await this.seatService.bookSeats(seatIds);
    await this.eventRepo.update(booking.eventId, {
      availableSeats: booking.event.availableSeats - seatIds.length,
    });

    await this.bookingRepo.confirm(bookingId, payment.transactionId, paymentMethod);
    const { qrCode, qrImage } = await this.ticketService.generateTicket(bookingId);

    return { bookingId, qrCode, qrImage };
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status === 'CANCELLED') throw new Error('Already cancelled');

    const seatIds = booking.bookingSeats.map((bs: { seatId: string }) => bs.seatId);
    await this.seatService.releaseSeats(seatIds);

    if (booking.status === 'CONFIRMED') {
      await this.eventRepo.update(booking.eventId, {
        availableSeats: booking.event.availableSeats + seatIds.length,
      });
      if (booking.paymentStatus === 'PAID') {
        this.paymentService.refundTransaction(booking.transactionId!);
      }
    }

    return this.bookingRepo.cancel(bookingId);
  }

  async getBookingById(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    return booking;
  }

  async getUserBookings(userId: string) {
    return this.bookingRepo.findByUserId(userId);
  }

  async getAllBookings() {
    return this.bookingRepo.findAll();
  }
}
