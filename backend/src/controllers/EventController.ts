import { Response } from 'express';
import { EventService } from '../services/EventService';
import { AuthRequest } from '../middleware/auth';

export class EventController {
  constructor(private eventService: EventService) {}

  getAllEvents = async (req: AuthRequest, res: Response) => {
    const events = await this.eventService.getAllEvents(req.query as any);
    res.json(events);
  };

  getEventById = async (req: AuthRequest, res: Response) => {
    try {
      const event = await this.eventService.getEventById(req.params['id'] as string);
      res.json(event);
    } catch (e: any) {
      res.status(404).json({ message: e.message });
    }
  };

  getEventSeats = async (req: AuthRequest, res: Response) => {
    const seats = await this.eventService.getEventSeats(req.params['id'] as string);
    res.json(seats);
  };

  createEvent = async (req: AuthRequest, res: Response) => {
    try {
      const event = await this.eventService.createEvent({ ...req.body, createdBy: req.user!.id });
      res.status(201).json(event);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  updateEvent = async (req: AuthRequest, res: Response) => {
    try {
      const event = await this.eventService.updateEvent(req.params['id'] as string, req.body);
      res.json(event);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
      await this.eventService.deleteEvent(req.params['id'] as string);
      res.json({ message: 'Event deleted' });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };
}
