import prisma from '../db/prisma';
import { BaseRepository } from './BaseRepository';

type TicketCreateInput = { bookingId: string; qrCode: string };

export class TicketRepository extends BaseRepository {
  async create(data: TicketCreateInput) {
    return prisma.ticket.create({ data });
  }

  async findById(id: string) {
    this.assertId(id, 'Ticket');
    return prisma.ticket.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.ticket.findMany({ orderBy: { issuedAt: 'desc' } });
  }

  async findByBookingId(bookingId: string) {
    return prisma.ticket.findUnique({ where: { bookingId } });
  }

  async findByQRCode(qrCode: string) {
    return prisma.ticket.findUnique({
      where: { qrCode },
      include: { booking: { include: { event: true, user: true } } },
    });
  }
}
