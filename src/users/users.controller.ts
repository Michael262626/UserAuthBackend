// src/users/users.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
