// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    try {
      return await this.authService.sendResetLink(dto);
    } catch (error) {
      // Log the error to the server log for debugging
      console.error('Error in forgotPassword:', error);
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(dto);
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
