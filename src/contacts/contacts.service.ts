import { Injectable } from '@nestjs/common';
import { Contacts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateContactDto, GetContactsQuery } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}
  async create(createContactDto: CreateContactDto, timezone: string) {
    const { lead_id, cnct_name, cnct_info, cnct_role, phone } =
      createContactDto;
    await this.prisma.contacts.create({
      data: { lead_id, cnct_name, cnct_info, cnct_role, phone },
    });
    const currentZone = await this.prisma.timeZones.findUnique({
      where: { timezone },
      select: { id: true },
    });
    await this.users.create({
      username: cnct_name,
      password: cnct_name,
      role: 'contact',
      time_id: currentZone['id'].toString(),
    });
  }

  async findAll(query: GetContactsQuery) {
    const { limit, offset, lead_id } = query;
    const where: any = {};
    if (lead_id) where.lead_id = Number(lead_id);

    const contacts = await this.prisma.contacts.findMany({
      where,
      take: limit ? Number(limit) : 10,
      skip: offset ? Number(offset) : 0,
    });

    const count = await this.prisma.contacts.count();

    // todo
    return { contacts, count, active: count, pending: 0 };
  }

  async findOne(id: number): Promise<Contacts> {
    return await this.prisma.contacts.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.contacts.delete({ where: { id } });
  }
}
