import { Injectable } from '@nestjs/common';
import { CreateContactDto, GetContactsQuery } from './dto/create-contact.dto';
import { Contacts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createContactDto: CreateContactDto) {
    const { lead_id, cnct_name, cnct_info, cnct_role, phone } =
      createContactDto;
    return await this.prisma.contacts.create({
      data: { lead_id, cnct_name, cnct_info, cnct_role, phone },
    });
  }

  async findAll(query: GetContactsQuery): Promise<Contacts[]> {
    const { limit, offset, lead_id } = query;
    const where: any = {};
    if (lead_id) where.lead_id = Number(lead_id);

    return await this.prisma.contacts.findMany({
      where,
      take: limit ? Number(limit) : 10,
      skip: offset ? Number(offset) : 0,
    });
  }

  async findOne(id: number): Promise<Contacts> {
    return await this.prisma.contacts.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.contacts.delete({ where: { id } });
  }
}
