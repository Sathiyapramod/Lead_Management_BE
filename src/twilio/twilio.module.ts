import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule],
  providers: [TwilioService, PrismaService, JwtService],
  controllers: [TwilioController],
})
export class TwilioModule {}
