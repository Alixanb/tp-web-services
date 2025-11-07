import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/entities/event.entity';
import { TicketCategory } from 'src/entities/ticket-category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, UserRole } from 'src/common/enum/role.enum';
import { User } from 'src/entities/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(TicketCategory)
    private ticketCategoryRepository: Repository<TicketCategory>,
  ) {}

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const { ticketCategories, ...eventData } = createEventDto;

    // Validate dates
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate <= new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    // Create event
    const event = this.eventRepository.create({
      ...eventData,
      organizerId: user.id,
    });

    const savedEvent = await this.eventRepository.save(event);

    // Create ticket categories
    if (ticketCategories && ticketCategories.length > 0) {
      const ticketCategoryEntities = ticketCategories.map((tc) =>
        this.ticketCategoryRepository.create({
          ...tc,
          eventId: savedEvent.id,
          availableStock: tc.totalStock,
        }),
      );

      await this.ticketCategoryRepository.save(ticketCategoryEntities);
    }

    return this.findOne(savedEvent.id);
  }

  async findAll(query: any): Promise<Event[]> {
    const {
      search,
      categoryId,
      city,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      status,
      includeAllStatuses,
    } = query;

    const includeAll =
      includeAllStatuses === true || includeAllStatuses === 'true';

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.venue', 'venue')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.ticketCategories', 'ticketCategories');

    // Search by title or description
    if (search) {
      queryBuilder.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by category
    if (categoryId) {
      queryBuilder.andWhere('event.categoryId = :categoryId', { categoryId });
    }

    // Filter by city
    if (city) {
      queryBuilder.andWhere('venue.city ILIKE :city', { city: `%${city}%` });
    }

    // Filter by date range
    if (startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', { endDate });
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      queryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM ticket_categories tc WHERE tc.eventId = event.id' +
          (minPrice ? ' AND tc.price >= :minPrice' : '') +
          (maxPrice ? ' AND tc.price <= :maxPrice' : '') +
          ')',
      );

      if (minPrice) queryBuilder.setParameter('minPrice', minPrice);
      if (maxPrice) queryBuilder.setParameter('maxPrice', maxPrice);
    }

    // Filter by status (default to PUBLISHED for non-authenticated requests)
    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
    } else if (!includeAll) {
      queryBuilder.andWhere('event.status = :status', {
        status: EventStatus.PUBLISHED,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['venue', 'category', 'organizer', 'ticketCategories'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Remove password from organizer
    if (event.organizer) {
      delete event.organizer.password;
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const event = await this.findOne(id);

    // Check ownership
    if (user.role !== UserRole.ADMIN && event.organizerId !== user.id) {
      throw new ForbiddenException('You can only update your own events');
    }

    Object.assign(event, updateEventDto);
    await this.eventRepository.save(event);

    return this.findOne(id);
  }

  async remove(id: string, user: User): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check ownership
    if (user.role !== UserRole.ADMIN && event.organizerId !== user.id) {
      throw new ForbiddenException('You can only delete your own events');
    }

    // Check if tickets have been sold
    if (event.tickets && event.tickets.length > 0) {
      throw new BadRequestException('Cannot delete event with sold tickets');
    }

    await this.eventRepository.remove(event);
  }
}
