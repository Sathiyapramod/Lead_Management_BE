import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { RecordCallDto } from './dto/createCall.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import moment from 'moment-timezone';

@Injectable()
export class TwilioService {
  private readonly client: Twilio;

  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.client = new Twilio(
      process.env.TWILIO_KEY_SID,
      process.env.TWILIO_KEY_SECRET,
      {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        logLevel: 'debug',
      },
    );
  }

  async makeCall(to: string): Promise<void> {
    const from = process.env.TWILIO_PHONE_NUMBER;
    try {
      const call = await this.client.calls.create({
        from,
        to,
        twiml: '<Response><Say>Ahoy, World!</Say></Response>',
        url: 'http://demo.twilio.com/docs/voice.xml',
      });
      const { startTime, endTime, status, dateCreated, sid } = call;
      this.callLog({ startTime, endTime, status, dateCreated, sid }, to);
    } catch (err) {
      console.log('err', err);
      throw new Error('Failed to make call');
    }
  }

  private async callLog(data: RecordCallDto, to: string): Promise<void> {
    const { startTime, endTime, status, sid } = data;

    const start_time = moment.tz(startTime, 'Asia/Kolkata').utc().toDate();
    const end_time = moment.tz(endTime, 'Asia/Kolkata').utc().toDate();

    await this.prisma.call_Logs.create({
      data: {
        sid,
        lead_id: Number(to),
        start_time,
        from_id: 2,
        end_time,
        status,
        duration: String(startTime),
      },
    });
  }
}
