import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/common/enum/role.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async findOne(id: string, user: User): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: [
        'event',
        'event.venue',
        'order',
        'order.user',
        'ticketCategory',
      ],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check access permissions
    if (user.role !== UserRole.ADMIN) {
      const isOwner = ticket.order.userId === user.id;
      const isOrganizer = ticket.event.organizerId === user.id;

      if (!isOwner && !isOrganizer) {
        throw new ForbiddenException('You do not have access to this ticket');
      }
    }

    // Remove sensitive data
    if (ticket.order?.user) {
      delete ticket.order.user.password;
    }

    return ticket;
  }

  async findByOrder(orderId: string, user: User): Promise<Ticket[]> {
    const tickets = await this.ticketRepository.find({
      where: { orderId },
      relations: ['event', 'event.venue', 'order', 'ticketCategory'],
    });

    if (tickets.length === 0) {
      return [];
    }

    // Check access permissions
    if (user.role !== UserRole.ADMIN) {
      const isOwner = tickets[0].order.userId === user.id;
      const isOrganizer = tickets.some(
        (ticket) => ticket.event.organizerId === user.id,
      );

      if (!isOwner && !isOrganizer) {
        throw new ForbiddenException('You do not have access to these tickets');
      }
    }

    return tickets;
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
    user: User,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id, user);

    // Only owner, organizer, or admin can update ticket
    const canUpdate =
      user.role === UserRole.ADMIN ||
      ticket.order.userId === user.id ||
      ticket.event.organizerId === user.id;

    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this ticket');
    }

    Object.assign(ticket, updateTicketDto);
    return this.ticketRepository.save(ticket);
  }
}
