import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { CallsService } from './calls.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('calls')
@ApiTags('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  @ApiOperation({ summary: 'Get All call schedule for Leads' })
  @ApiBearerAuth()
  async getCallListByDate(@Query() query: Record<string, string>) {
    return await this.callsService.getCallScheduleByDate(query);
  }
}
