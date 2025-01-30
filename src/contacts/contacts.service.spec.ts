import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact_Roles } from '@prisma/client';

const mockPrismaService = {
  contacts: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  timeZones: {
    findUnique: jest.fn(),
  },
};

const mockUsersService = {
  create: jest.fn(),
};

describe('ContactsService', () => {
  let service: ContactsService;
  let prisma: PrismaService;
  let users: UsersService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Logger, useValue: { log: jest.fn(), error: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    prisma = module.get<PrismaService>(PrismaService);
    users = module.get<UsersService>(UsersService);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('create', () => {
    it('it should create a contact & user register', async () => {
      const createContactDto: CreateContactDto = {
        lead_id: 1,
        cnct_name: 'John Doe',
        cnct_info: 'Some info',
        cnct_role: Contact_Roles['general_manager'],
        phone: '1234567890',
      };
      const timezone = 'UTC';
      const mockTimeZone = { id: 1 };

      mockPrismaService.timeZones.findUnique.mockResolvedValue(mockTimeZone);
      mockPrismaService.contacts.create.mockResolvedValue(createContactDto);
      mockUsersService.create.mockResolvedValue({ id: 1, ...createContactDto });

      const result = await service.create(createContactDto, timezone);
      expect(prisma.contacts.create).toHaveBeenCalledWith({
        data: createContactDto,
      });
      expect(prisma.timeZones.findUnique).toHaveBeenCalledWith({
        where: { timezone },
        select: { id: true },
      });

      expect(users.create).toHaveBeenCalledWith({
        username: createContactDto.cnct_name,
        password: createContactDto.cnct_name,
        role: 'contact',
        time_id: mockTimeZone.id.toString(),
      });
      expect(result).toEqual({ id: 1, ...createContactDto });
      expect(logger.log).toHaveBeenCalledWith(
        `Contact - ${createContactDto.cnct_name} created successfully`,
      );
    });

    it('should handle create user errors', async () => {
      const createContactDto: CreateContactDto = {
        lead_id: 1,
        cnct_name: 'John Doe',
        cnct_info: 'Some info',
        cnct_role: Contact_Roles['general_manager'],
        phone: '1234567890',
      };
      const timezone = 'UTC';

      mockPrismaService.contacts.create.mockRejectedValue(
        new Error('Error creating contact'),
      );

      await service.create(createContactDto, timezone);

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
