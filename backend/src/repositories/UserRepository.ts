import prisma from '../db/prisma';
import { BaseRepository } from './BaseRepository';

type UserCreateInput = { name: string; email: string; passwordHash: string };

export class UserRepository extends BaseRepository {
  async create(data: UserCreateInput) {
    return prisma.user.create({ data });
  }

  async findById(id: string) {
    this.assertId(id, 'User');
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
