import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enum/role.enum';
import { Event } from 'src/entities/event.entity';
import { Order } from 'src/entities/order.entity';
import { TicketCategory } from 'src/entities/ticket-category.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { DataSource } from 'typeorm';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const orderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const ticketRepository = { find: jest.fn() };
  const ticketCategoryRepository = {};
  const eventRepository = {};
  const dataSource = { createQueryRunner: jest.fn() };

  const baseOrder: Order = {
    id: 'order-1',
    userId: 'user-1',
    status: undefined as any,
    totalAmount: 100,
    orderDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tickets: [
      {
        id: 'ticket-1',
        event: { organizerId: 'organizer-1' },
      },
    ] as any,
    user: { id: 'user-1', password: 'secret' } as any,
    mapTicketVenue: () => undefined,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: orderRepository },
        { provide: getRepositoryToken(Ticket), useValue: ticketRepository },
        {
          provide: getRepositoryToken(TicketCategory),
          useValue: ticketCategoryRepository,
        },
        { provide: getRepositoryToken(Event), useValue: eventRepository },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll admin retourne toutes les commandes', async () => {
    orderRepository.find.mockResolvedValue([baseOrder]);

    const orders = await service.findAll({ id: 'admin', role: UserRole.ADMIN } as any);

    expect(orderRepository.find).toHaveBeenCalledWith({
      relations: ['user', 'tickets', 'tickets.event'],
    });
    expect(orders).toEqual([baseOrder]);
  });

  it('findAll client filtre sur userId', async () => {
    orderRepository.find.mockResolvedValue([baseOrder]);

    await service.findAll({ id: 'user-1', role: UserRole.CLIENT } as any);

    expect(orderRepository.find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      relations: ['tickets', 'tickets.event'],
    });
  });

  it('findOne supprime le mot de passe et rend la commande', async () => {
    orderRepository.findOne.mockResolvedValue({ ...baseOrder });

    const order = await service.findOne(
      'order-1',
      { id: 'user-1', role: UserRole.CLIENT } as any,
    );

    expect(orderRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      relations: expect.any(Array),
    });
    expect(order.user?.password).toBeUndefined();
  });

  it('findOne refuse l’accès si non admin et non concerné', async () => {
    orderRepository.findOne.mockResolvedValue({ ...baseOrder });

    await expect(
      service.findOne('order-1', { id: 'stranger', role: UserRole.CLIENT } as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('findOne lève NotFound quand inexistant', async () => {
    orderRepository.findOne.mockResolvedValue(null);

    await expect(
      service.findOne('missing', { id: 'admin', role: UserRole.ADMIN } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
