import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeadsService } from 'src/leads/leads.service';
import { ManagersService } from 'src/managers/managers.service';
import * as moment from 'moment-timezone';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AccessToken = require('twilio').jwt.AccessToken;

@Injectable()
export class TwilioService {
  private readonly client: Twilio;

  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly leads: LeadsService,
    private readonly managers: ManagersService,
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
      await this.client.calls.create({
        from,
        to,
        url: 'http://demo.twilio.com/docs/voice.xml',
        record: true,
        recordingStatusCallback: `${process.env.DEMO_PUBLIC_URL}/call-logs/record-callback`,
      });
      console.log(`Call is Queued`);
    } catch (err) {
      console.log('err', err);
      throw new Error('Failed to make call');
    }
  }

  async recordCallback(data: {
    RecordingUrl: string;
    CallSid: string;
    RecordingDuration: string;
    RecordingStartTime: string;
    RecordingStatus: string;
  }) {
    try {
      const {
        RecordingUrl,
        CallSid,
        RecordingDuration,
        RecordingStartTime,
        RecordingStatus,
      } = data;

      const { from, to } = await this.client.calls(CallSid).fetch();

      //find lead id
      const lead = await this.leads.findLeadByPhoneNo(to);
      //find kam id
      const kam = await this.managers.findKAMByPhoneNo(from);

      const start_time = new Date(RecordingStartTime);

      const durationInSeconds = parseInt(RecordingDuration, 10);
      const end_time = new Date(
        start_time.getTime() + durationInSeconds * 1000,
      );

      console.log(`Storing Call Log !!!`);
      await this.prisma.call_Logs.create({
        data: {
          recording_uri: RecordingUrl,
          recording_sid: CallSid,
          sid: CallSid,
          lead_id: lead.id,
          from_id: kam.id,
          status: RecordingStatus,
          duration: RecordingDuration,
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
        },
      });
      console.log(`Updating Lead data !!!`);
      await this.leads.updateCallHistory(lead.id, new Date(RecordingStartTime));
    } catch (err) {
      console.log('err', err);
      throw new Error('Failed to Record call');
    }
  }

  async getCallLogs(timezone: string) {
    try {
      const callLogs = await this.prisma.call_Logs.findMany();
      return callLogs.map((call) => {
        const start_time = moment(call.start_time).tz(timezone).format();
        const end_time = moment(call.end_time).tz(timezone).format();

        return {
          ...call,
          start_time,
          end_time,
        };
      });
    } catch (err) {
      console.log('err', err);
      throw new Error('Failed to Record call');
    }
  }

  async getToken() {
    try {
      const VoiceGrant = AccessToken.VoiceGrant;
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioApiKey = process.env.TWILI_API_KEY;
      const twilioApiSecret = process.env.TWILIO_API_SECRET;

      const identity = 'user';
      const accessToken = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        { identity: identity },
      );
      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
        incomingAllow: true,
      });

      accessToken.addGrant(voiceGrant);
      const token = accessToken.toJwt();
      return { token };
    } catch (error) {
      throw error;
    }
  }
}
