import { EventRepository } from '../repositories/EventRepository';
import { SeatRepository } from '../repositories/SeatRepository';
import { IEventService } from './interfaces';

export class EventService implements IEventService {
  constructor(private eventRepo: EventRepository, private seatRepo: SeatRepository) {}

  async createEvent(data: {
    name: string; description: string; venue: string; eventDate: Date;
    rows: number; seatsPerRow: number; sections: string[]; pricePerSeat: number; createdBy: string; bannerImage?: string; category?: string;
  }) {
    if (data.rows <= 0 || data.seatsPerRow <= 0) throw new Error('Rows and seats per row must be greater than 0');
    if (new Date(data.eventDate) <= new Date()) throw new Error('Event date must be in the future');
    if (data.sections.length === 0) throw new Error('At least one section is required');
    if (data.pricePerSeat <= 0) throw new Error('Price must be greater than 0');

    const totalSeats = data.rows * data.seatsPerRow * data.sections.length;
    const event = await this.eventRepo.create({
      name: data.name, description: data.description, venue: data.venue,
      eventDate: data.eventDate, totalSeats, availableSeats: totalSeats,
      createdBy: data.createdBy, bannerImage: data.bannerImage, category: data.category || 'Other',
    });

    const seats = [];
    for (const section of data.sections) {
      for (let r = 0; r < data.rows; r++) {
        const row = String.fromCharCode(65 + r);
        for (let s = 1; s <= data.seatsPerRow; s++) {
          seats.push({ eventId: event.id, seatNumber: String(s), row, section, price: data.pricePerSeat });
        }
      }
    }
    await this.seatRepo.createMany(seats);
    return event;
  }

  async getAllEvents(filters?: { name?: string; venue?: string; category?: string }) {
    return this.eventRepo.findAll(filters);
  }

  async getEventById(id: string) {
    const event = await this.eventRepo.findById(id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async getEventSeats(eventId: string) {
    return this.seatRepo.findByEventId(eventId);
  }

  async updateEvent(id: string, data: Partial<{ name: string; description: string; venue: string; eventDate: Date }>) {
    return this.eventRepo.update(id, data);
  }

  async deleteEvent(id: string) {
    return this.eventRepo.delete(id);
  }
}
