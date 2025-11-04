import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from 'src/entities/order.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketCategory } from 'src/entities/ticket-category.entity';
import { Event } from 'src/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Ticket, TicketCategory, Event])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
