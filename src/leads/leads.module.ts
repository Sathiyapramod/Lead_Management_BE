import { Logger, Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, PrismaService, JwtService, UsersService, Logger],
  exports: [LeadsService],
})
export class LeadsModule {}
