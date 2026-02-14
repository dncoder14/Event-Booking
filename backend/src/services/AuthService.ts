import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { IAuthService } from './interfaces';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService implements IAuthService {
  constructor(private userRepo: UserRepository) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, passwordHash });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  }
}
