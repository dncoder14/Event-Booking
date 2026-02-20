import prisma from '../db/prisma';
import { SeatStatus } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

type SeatCreateInput = {
  eventId: string;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
};

export class SeatRepository extends BaseRepository {
  /** BaseRepository.create — creates a single seat. */
  async create(data: SeatCreateInput) {
    return prisma.seat.create({ data });
  }

  /** BaseRepository.findById — find one seat by ID. */
  async findById(id: string) {
    this.assertId(id, 'Seat');
    return prisma.seat.findUnique({ where: { id } });
  }

  /** BaseRepository.findAll — return all seats. */
  async findAll() {
    return prisma.seat.findMany({
      orderBy: [{ section: 'asc' }, { row: 'asc' }, { seatNumber: 'asc' }],
    });
  }

  // ── Domain-specific methods ──────────────────────────────────────

  async createMany(seats: SeatCreateInput[]) {
    return prisma.seat.createMany({ data: seats });
  }

  async findByEventId(eventId: string) {
    return prisma.seat.findMany({
      where: { eventId },
      orderBy: [{ section: 'asc' }, { row: 'asc' }, { seatNumber: 'asc' }],
    });
  }

  async findByIds(ids: string[]) {
    return prisma.seat.findMany({ where: { id: { in: ids } } });
  }

  async lockSeats(ids: string[], userId: string, lockedUntil: Date) {
    return prisma.seat.updateMany({
      where: { id: { in: ids }, status: SeatStatus.AVAILABLE },
      data: { status: SeatStatus.LOCKED, lockedBy: userId, lockedUntil },
    });
  }

  async bookSeats(ids: string[]) {
    return prisma.seat.updateMany({
      where: { id: { in: ids } },
      data: { status: SeatStatus.BOOKED, lockedUntil: null },
    });
  }

  async releaseSeats(ids: string[]) {
    return prisma.seat.updateMany({
      where: { id: { in: ids } },
      data: { status: SeatStatus.AVAILABLE, lockedBy: null, lockedUntil: null },
    });
  }

  async releaseExpiredLocks() {
    return prisma.seat.updateMany({
      where: { status: SeatStatus.LOCKED, lockedUntil: { lt: new Date() } },
      data: { status: SeatStatus.AVAILABLE, lockedBy: null, lockedUntil: null },
    });
  }
}
