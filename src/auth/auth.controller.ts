// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(body.username, body.email, body.password);
    res.cookie('access_token', tokens.access_token, { httpOnly: true });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
    return { message: 'User registered' };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(body.email, body.password);
    res.cookie('access_token', tokens.access_token, { httpOnly: true });
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
    return { message: 'Logged in successfully' };
  }

  @Post('refresh')
  async refresh(@Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refreshToken(res.req.cookies.refresh_token);
    res.cookie('access_token', tokens.access_token, { httpOnly: true });
    return { message: 'Access token refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Res() res: Response) {
    return res.locals.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }
}
