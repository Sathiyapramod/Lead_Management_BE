import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';
import { MenuService } from '../menu/menu.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let menuService: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: MenuService,
          useValue: {
            getMenuByRole: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            timeZones: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    menuService = module.get<MenuService>(MenuService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  // validate users
  describe('validateUser', () => {
    it('should return the user if password matches', async () => {
      const user = {
        username: 'john doe',
        password: await bcrypt.hash('123456', 10),
        id: 203,
        role: Roles['KAM'],
        time_id: 318,
        menu: ['Home', 'Order', 'Lead', 'Contact'],
        TimeZones: {
          timezone: 'Asia/Vientiane',
        },
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(async (password: string, hash: string) => {
          return password === '123456' && hash === user.password;
        });

      const result = await service.validateUser({
        username: 'john doe',
        password: '123456',
      });
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith('john doe');
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', user.password);
    });

    it('should return null if the password does not match', async () => {
      const user = {
        username: 'john doe',
        password: await bcrypt.hash('123456', 10),
        id: 203,
        role: Roles['KAM'],
        time_id: 318,
        TimeZones: {
          timezone: 'Asia/Vientiane',
        },
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(async (password: string, hash: string) => {
          return password === '123456' && hash === user.password;
        });
      const result = await service.validateUser({
        username: 'john doe',
        password: '1234567',
      });

      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith('john doe');
      expect(bcrypt.compare).toHaveBeenCalledWith('1234567', user.password);
    });
  });

  // login tests
  describe('login', () => {
    it('should return a valid access token and user info on successful login', async () => {
      const user = {
        username: 'john doe',
        password: await bcrypt.hash('123456', 10),
        id: 203,
        role: Roles['KAM'],
        time_id: 318,
        TimeZones: {
          timezone: 'Asia/Vientiane',
        },
      };
      const mockMenus = ['Home', 'Order', 'Lead', 'Contact'];

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('dummy_token');
      jest.spyOn(menuService, 'getMenuByRole').mockResolvedValue(mockMenus);

      const result = await service.login(user);
      expect(service.validateUser).not.toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: user.username,
        userId: user.id,
        role: user.role,
        timezone: user.TimeZones.timezone,
      });
      expect(result).toEqual({
        access_token: 'dummy_token',
        username: user.username,
        role: user.role,
        userId: user.id,
        timezone: user.TimeZones.timezone,
        menu: mockMenus,
      });
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);
      const loginDto = { username: 'john doe', password: 'wrongpassword' };
      await expect(service.validateUser(loginDto)).resolves.toBeNull();
      expect(service.validateUser).toHaveBeenCalledWith(loginDto);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
