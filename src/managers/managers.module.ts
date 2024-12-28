import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ManagersController],
  providers: [ManagersService, PrismaService, JwtService],
  exports: [ManagersService],
})
export class ManagersModule {}
