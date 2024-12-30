import {
  Controller,
  Post,
  Query,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TwilioService } from './twilio.service';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { Roles } from 'src/auth/roles.decorator';
// import { Roles as UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';

@Controller('call-logs')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('calls')
  async makeCall(@Query() query: { to: string }) {
    const { to } = query as { to: string };
    if (!to) throw new Error('Phone number is required');
    return await this.twilioService.makeCall(to);
  }

  @Post('record-callback')
  async recordCall(@Body() body: any) {
    const {
      RecordingUrl,
      CallSid,
      RecordingDuration,
      RecordingStartTime,
      RecordingStatus,
    } = body;
    await this.twilioService.recordCallback({
      RecordingUrl,
      CallSid,
      RecordingDuration,
      RecordingStartTime,
      RecordingStatus,
    });
  }

  @Get('call-list')
  @UseGuards(JwtAuthGuard)
  async getCalls(@Req() request: any) {
    const { timezone } = request.user;
    return await this.twilioService.getCallLogs(timezone);
  }

  @Get('token')
  async getToken() {
    return await this.twilioService.getToken();
  }
}
