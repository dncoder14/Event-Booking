import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';

const router = Router();
const controller = new AuthController(new AuthService(new UserRepository()));

router.post('/register', controller.register);
router.post('/login', controller.login);

export default router;
