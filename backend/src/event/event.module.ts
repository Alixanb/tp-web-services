import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from 'src/entities/event.entity';
import { TicketCategory } from 'src/entities/ticket-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketCategory])],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
