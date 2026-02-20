import { SeatRepository } from '../repositories/SeatRepository';
import { ISeatService } from './interfaces';

export class SeatService implements ISeatService {
  constructor(private seatRepo: SeatRepository) {}

  async checkAndLock(seatIds: string[], userId: string): Promise<void> {
    const seats = await this.seatRepo.findByIds(seatIds);
    if (seats.length !== seatIds.length) throw new Error('Some seats not found');

    const now = new Date();
    const unavailable = seats.filter((s: { status: string; lockedUntil: Date | null }) => {
      if (s.status === 'BOOKED') return true;
      if (s.status === 'LOCKED' && s.lockedUntil && s.lockedUntil > now) return true;
      return false;
    });
    if (unavailable.length > 0) throw new Error('Some seats are not available');

    const lockedUntil = new Date(now.getTime() + 10 * 60 * 1000);
    const result = await this.seatRepo.lockSeats(seatIds, userId, lockedUntil);
    if (result.count !== seatIds.length) throw new Error('Seat lock conflict, please retry');
  }

  async getSeatsByIds(seatIds: string[]) {
    return this.seatRepo.findByIds(seatIds);
  }

  async bookSeats(seatIds: string[]) {
    return this.seatRepo.bookSeats(seatIds);
  }

  async releaseSeats(seatIds: string[]) {
    return this.seatRepo.releaseSeats(seatIds);
  }
}
