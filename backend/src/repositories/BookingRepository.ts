import prisma from '../db/prisma';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

type BookingCreateInput = {
  userId: string;
  eventId: string;
  totalAmount: number;
  seatIds: { seatId: string; priceAtBooking: number }[];
};

export class BookingRepository extends BaseRepository {
  async create(data: BookingCreateInput) {
    return prisma.booking.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        totalAmount: data.totalAmount,
        bookingSeats: { create: data.seatIds },
      },
      include: { bookingSeats: true },
    });
  }

  async findById(id: string) {
    this.assertId(id, 'Booking');
    return prisma.booking.findUnique({
      where: { id },
      include: { bookingSeats: { include: { seat: true } }, ticket: true, event: true },
    });
  }

  async findAll() {
    return prisma.booking.findMany({
      include: { user: true, event: true, bookingSeats: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: { event: true, bookingSeats: { include: { seat: true } }, ticket: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirm(id: string, transactionId: string, paymentMethod: string) {
    return prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, transactionId, paymentMethod },
    });
  }

  async cancel(id: string) {
    return prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED, paymentStatus: PaymentStatus.REFUNDED },
    });
  }
}
