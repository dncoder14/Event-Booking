import prisma from '../db/prisma';
import { BaseRepository } from './BaseRepository';

type EventCreateInput = {
  name: string;
  description: string;
  venue: string;
  eventDate: Date;
  totalSeats: number;
  availableSeats: number;
  createdBy: string;
  bannerImage?: string;
  category?: string;
};

type EventFilters = { name?: string; venue?: string; category?: string };

export class EventRepository extends BaseRepository {
  async create(data: EventCreateInput) {
    return prisma.event.create({ data });
  }

  async findAll(filters?: EventFilters) {
    return prisma.event.findMany({
      where: {
        ...(filters?.name && { name: { contains: filters.name, mode: 'insensitive' } }),
        ...(filters?.venue && { venue: { contains: filters.venue, mode: 'insensitive' } }),
        ...(filters?.category && { category: { equals: filters.category, mode: 'insensitive' } }),
      },
      orderBy: { eventDate: 'asc' },
    });
  }

  async findById(id: string) {
    this.assertId(id, 'Event');
    return prisma.event.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<{ name: string; description: string; venue: string; eventDate: Date; availableSeats: number; category: string }>) {
    return prisma.event.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}
