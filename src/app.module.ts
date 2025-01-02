import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { PrismaService } from './prisma/prisma.service';
import { ManagersModule } from './managers/managers.module';
import { TwilioService } from './twilio/twilio.service';
import { ConfigModule } from '@nestjs/config';
import { TwilioController } from './twilio/twilio.controller';
import { TwilioModule } from './twilio/twilio.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CallsModule } from './calls/calls.module';
import { OrdersModule } from './orders/orders.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    LeadsModule,
    ManagersModule,
    ConfigModule.forRoot(),
    TwilioModule,
    ContactsModule,
    UsersModule,
    AuthModule,
    CallsModule,
    OrdersModule,
    PerformanceModule,
  ],
  controllers: [AppController, TwilioController],
  providers: [AppService, PrismaService, TwilioService, JwtService],
})
export class AppModule {}
