import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { TicketCategory } from 'src/entities/ticket-category.entity';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getRepositoryToken(Event), useValue: {} },
        { provide: getRepositoryToken(TicketCategory), useValue: {} },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
