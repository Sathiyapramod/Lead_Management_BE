import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, PrismaService, JwtService],
  exports: [LeadsService],
})
export class LeadsModule {}
