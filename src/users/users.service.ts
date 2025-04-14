// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByUsername(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async createUser(username: string, email: string, password: string) {
    const user = this.repo.create({ username, email, password });
    return this.repo.save(user);
  }
}
