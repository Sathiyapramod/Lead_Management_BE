import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, GetContactsQuery } from './dto/create-contact.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  create(@Body() createContactDto: CreateContactDto, @Req() req: any) {
    const { timezone } = req.user;
    return this.contactsService.create(createContactDto, timezone);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: GetContactsQuery) {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
