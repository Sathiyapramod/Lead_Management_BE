import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { WinstonModule } from 'nest-winston';
import { instance } from 'logger/winston.logger';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const prisma = new PrismaClient();

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log(`🤝 Database Connected Successfully ✅`);
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({
        instance: instance,
      }),
    });

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.enableCors();
    const config = new DocumentBuilder()
      .setTitle('Lead Management')
      .setDescription('Management Tool Designed for KAMs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000, () =>
      console.log(
        `👍 KAM (LMS) Server is running on port ${process.env.PORT} ✨`,
      ),
    );
  } catch (err) {
    console.error('Database connection failed: 🛑', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  console.log('closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});
