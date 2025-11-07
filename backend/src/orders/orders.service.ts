import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketCategory } from 'src/entities/ticket-category.entity';
import { Event } from 'src/entities/event.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderStatus,
  TicketStatus,
  EventStatus,
  UserRole,
} from 'src/common/enum/role.enum';
import { User } from 'src/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketCategory)
    private ticketCategoryRepository: Repository<TicketCategory>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { items } = createOrderDto;

    // Validate max 10 tickets per order
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity > 10) {
      throw new BadRequestException(
        'Cannot purchase more than 10 tickets per order',
      );
    }

    // Use transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const ticketsToCreate: Partial<Ticket>[] = [];

      // Process each item
      for (const item of items) {
        const ticketCategory = await queryRunner.manager.findOne(
          TicketCategory,
          {
            where: { id: item.ticketCategoryId },
            relations: ['event'],
          },
        );

        if (!ticketCategory) {
          throw new NotFoundException(
            `Ticket category ${item.ticketCategoryId} not found`,
          );
        }

        // Check if event is not cancelled
        if (ticketCategory.event.status === EventStatus.CANCELLED) {
          throw new BadRequestException(
            'Cannot purchase tickets for cancelled event',
          );
        }

        const categoryPrice = Number(ticketCategory.price);

        if (!Number.isFinite(categoryPrice)) {
          throw new BadRequestException(
            `Invalid price configuration for ${ticketCategory.name}`,
          );
        }

        // Verify price matches current price
        if (categoryPrice !== item.price) {
          throw new BadRequestException(
            `Price mismatch for ${ticketCategory.name}. Current price is ${ticketCategory.price}`,
          );
        }

        // Check stock availability
        if (ticketCategory.availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${ticketCategory.name}. Only ${ticketCategory.availableStock} tickets available`,
          );
        }

        // Reserve stock
        ticketCategory.availableStock -= item.quantity;
        await queryRunner.manager.save(ticketCategory);

        // Prepare tickets
        for (let i = 0; i < item.quantity; i++) {
          const qrCode = this.generateQRCode();
          ticketsToCreate.push({
            ticketCategoryId: item.ticketCategoryId,
            eventId: ticketCategory.event.id,
            qrCode,
            price: categoryPrice,
            status: TicketStatus.ACTIVE,
          });
          totalAmount += categoryPrice;
        }
      }

      // Create order
      const order = queryRunner.manager.create(Order, {
        userId: user.id,
        status: OrderStatus.PENDING,
        totalAmount,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create tickets
      const tickets = ticketsToCreate.map((t) =>
        queryRunner.manager.create(Ticket, {
          ...t,
          orderId: savedOrder.id,
        }),
      );

      await queryRunner.manager.save(tickets);

      // Simulate payment (in real scenario, call payment gateway)
      const paymentSuccess = await this.simulatePayment();

      if (paymentSuccess) {
        savedOrder.status = OrderStatus.PAID;
        await queryRunner.manager.save(savedOrder);
      } else {
        // Payment failed, rollback by marking as cancelled
        savedOrder.status = OrderStatus.CANCELLED;
        await queryRunner.manager.save(savedOrder);

        // Release stock
        for (const item of items) {
          const ticketCategory = await queryRunner.manager.findOne(
            TicketCategory,
            {
              where: { id: item.ticketCategoryId },
            },
          );
          ticketCategory.availableStock += item.quantity;
          await queryRunner.manager.save(ticketCategory);
        }

        throw new BadRequestException('Payment failed');
      }

      await queryRunner.commitTransaction();

      // Return order with tickets
      return this.findOne(savedOrder.id, user);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(user: User): Promise<Order[]> {
    if (user.role === UserRole.ADMIN) {
      return this.orderRepository.find({
        relations: ['user', 'tickets', 'tickets.event'],
      });
    }

    return this.orderRepository.find({
      where: { userId: user.id },
      relations: ['tickets', 'tickets.event'],
    });
  }

  async findOne(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'user',
        'tickets',
        'tickets.event',
        'tickets.event.venue',
        'tickets.ticketCategory',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check access permissions
    if (user.role !== UserRole.ADMIN && order.userId !== user.id) {
      // Check if user is organizer of any event in this order
      const isOrganizer = order.tickets.some(
        (ticket) => ticket.event.organizerId === user.id,
      );

      if (!isOrganizer) {
        throw new ForbiddenException('You do not have access to this order');
      }
    }

    // Remove sensitive data
    if (order.user) {
      delete order.user.password;
    }

    return order;
  }

  private generateQRCode(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(16).toString('hex');
    return `EVT_${timestamp}_${random}`;
  }

  private async simulatePayment(): Promise<boolean> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 95% success rate for simulation
    return Math.random() > 0.05;
  }
}
