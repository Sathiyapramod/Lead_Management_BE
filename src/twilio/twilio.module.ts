import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LeadsService } from 'src/leads/leads.service';
import { ManagersService } from 'src/managers/managers.service';

@Module({
  imports: [ConfigModule],
  providers: [
    TwilioService,
    PrismaService,
    JwtService,
    LeadsService,
    ManagersService,
  ],
  controllers: [TwilioController],
})
export class TwilioModule {}
