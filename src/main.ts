import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from 'exception/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,              
  });

  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3003);
}
bootstrap();
