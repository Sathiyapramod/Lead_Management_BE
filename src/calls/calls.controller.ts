import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('calls')
@ApiTags('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get All call schedule for Leads' })
  @ApiBearerAuth()
  async getCallListByDate(@Query() query: Record<string, string>) {
    return await this.callsService.getCallScheduleByDate(query);
  }
}
