import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { EventService } from '../services/EventService';
import { EventRepository } from '../repositories/EventRepository';
import { SeatRepository } from '../repositories/SeatRepository';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const controller = new EventController(new EventService(new EventRepository(), new SeatRepository()));

router.get('/', controller.getAllEvents);
router.get('/:id', controller.getEventById);
router.get('/:id/seats', controller.getEventSeats);
router.post('/', authenticate, requireAdmin, controller.createEvent);
router.put('/:id', authenticate, requireAdmin, controller.updateEvent);
router.delete('/:id', authenticate, requireAdmin, controller.deleteEvent);

export default router;
