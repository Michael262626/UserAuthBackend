import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm/repository/Repository';
import { MailerModule } from '@nestjs-modules/mailer';  // Import MailerModule
import { MAILER_OPTIONS } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,  // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
  ],
})
export class AppModule {}
