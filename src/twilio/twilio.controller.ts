import { Controller, Post, Query, UseGuards, Req } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('calls')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  async makeCall(@Query() query: { to: string }, @Req() request: any) {
    const { to } = query as { to: string };
    const userId = request.user.userId;
    if (!to) throw new Error('Phone number is required');
    return await this.twilioService.makeCall(to);
  }
}
