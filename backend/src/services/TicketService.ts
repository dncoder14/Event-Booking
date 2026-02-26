import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { TicketRepository } from '../repositories/TicketRepository';
import { ITicketService } from './interfaces';

export class TicketService implements ITicketService {
  constructor(private ticketRepo: TicketRepository) {}

  async generateTicket(bookingId: string): Promise<{ qrCode: string; qrImage: string }> {
    const qrCode = uuidv4();
    const qrImage = await QRCode.toDataURL(qrCode);
    await this.ticketRepo.create({ bookingId, qrCode });
    return { qrCode, qrImage };
  }

  async validateTicket(qrCode: string) {
    const ticket = await this.ticketRepo.findByQRCode(qrCode);
    if (!ticket || !ticket.isValid) throw new Error('Invalid ticket');
    return ticket;
  }
}
