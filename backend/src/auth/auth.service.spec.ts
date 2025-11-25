import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuditService } from 'src/audit/audit.service';
import { UserRole } from 'src/common/enum/role.enum';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const userRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn(),
  };
  const auditService = {
    log: jest.fn(),
  };
  const baseUser: User = {
    id: 'user-1',
    email: 'john@example.com',
    password: 'hashed',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.CLIENT,
    phoneNumber: null,
    orders: [],
    organizedEvents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register crée un utilisateur et retourne un token', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPwd');
    userRepository.findOne.mockResolvedValue(null);
    userRepository.create.mockReturnValue({ ...baseUser, password: 'hashedPwd' });
    userRepository.save.mockResolvedValue(baseUser);
    jwtService.sign.mockReturnValue('jwt-token');

    const result = await service.register({
      email: baseUser.email,
      password: 'plain',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    expect(result.token).toBe('jwt-token');
    expect(result.user.password).toBeUndefined();
  });

  it('register lève Conflict si email utilisé', async () => {
    userRepository.findOne.mockResolvedValue(baseUser);

    await expect(
      service.register({
        email: baseUser.email,
        password: 'plain',
        firstName: 'John',
        lastName: 'Doe',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('login journalise les échecs et lève Unauthorized', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(
      service.login({ email: baseUser.email, password: 'plain' }, '127.0.0.1'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(auditService.log).toHaveBeenCalledWith(
      'LOGIN_FAILED',
      null,
      '127.0.0.1',
      expect.stringContaining(baseUser.email),
    );
  });

  it('login retourne un token si credentials valides', async () => {
    userRepository.findOne.mockResolvedValue({ ...baseUser });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('jwt-token');

    const result = await service.login(
      { email: baseUser.email, password: 'plain' },
      '127.0.0.1',
    );

    expect(bcrypt.compare).toHaveBeenCalledWith('plain', baseUser.password);
    expect(auditService.log).toHaveBeenCalledWith(
      'LOGIN_SUCCESS',
      baseUser.id,
      '127.0.0.1',
    );
    expect(result.token).toBe('jwt-token');
    expect(result.user.password).toBeUndefined();
  });
});
