import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enum/role.enum';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  let service: TicketsService;

  const ticketRepository = {
    findOne: jest.fn(),
  };

  const baseTicket: Ticket = {
    id: 'ticket-1',
    qrCode: 'QR',
    price: 100,
    status: undefined as any,
    eventId: 'event-1',
    venueId: 'venue-1',
    orderId: 'order-1',
    ticketCategoryId: 'cat-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    event: {
      id: 'event-1',
      organizerId: 'organizer-1',
    } as any,
    order: {
      id: 'order-1',
      userId: 'client-1',
      user: { id: 'client-1', password: 'secret' } as any,
    } as any,
    ticketCategory: {} as any,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: ticketRepository,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne supprime le mot de passe et retourne le ticket', async () => {
    ticketRepository.findOne.mockResolvedValue({ ...baseTicket });

    const ticket = await service.findOne('ticket-1', {
      id: 'client-1',
      role: UserRole.CLIENT,
    } as any);

    expect(ticketRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'ticket-1' },
      relations: expect.any(Array),
    });
    expect(ticket.order.user?.password).toBeUndefined();
  });

  it('findOne refuse l’accès si l’utilisateur n’est ni admin ni propriétaire', async () => {
    ticketRepository.findOne.mockResolvedValue({ ...baseTicket });

    await expect(
      service.findOne('ticket-1', { id: 'other', role: UserRole.CLIENT } as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('findOne lève NotFound lorsque le ticket est absent', async () => {
    ticketRepository.findOne.mockResolvedValue(null);

    await expect(
      service.findOne('missing', { id: 'admin', role: UserRole.ADMIN } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
