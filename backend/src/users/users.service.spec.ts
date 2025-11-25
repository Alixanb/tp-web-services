import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enum/role.enum';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const userRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const sampleUser: User = {
    id: 'user-1',
    email: 'john@example.com',
    password: 'hashed',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.CLIENT,
    phoneNumber: '123',
    orders: [],
    organizedEvents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll retourne les champs exposés', async () => {
    userRepository.find.mockResolvedValue([sampleUser]);

    const result = await service.findAll();

    expect(userRepository.find).toHaveBeenCalledWith({
      select: expect.arrayContaining(['id', 'email', 'firstName']),
    });
    expect(result).toEqual([sampleUser]);
  });

  it('findOne retourne l’utilisateur lorsqu’il existe', async () => {
    userRepository.findOne.mockResolvedValue(sampleUser);

    const user = await service.findOne('user-1');

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: expect.any(Array),
    });
    expect(user).toEqual(sampleUser);
  });

  it('findOne lève NotFoundException si absent', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update fusionne les champs et sauvegarde', async () => {
    const changes = { firstName: 'Jane' };
    userRepository.findOne.mockResolvedValue({ ...sampleUser });
    userRepository.save.mockResolvedValue({ ...sampleUser, ...changes });

    const updated = await service.update('user-1', changes);

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(changes),
    );
    expect(updated.firstName).toBe('Jane');
  });
});
