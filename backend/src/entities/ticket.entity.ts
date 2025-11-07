import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Order } from './order.entity';
import { TicketCategory } from './ticket-category.entity';
import { TicketStatus } from 'src/common/enum/role.enum';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.tickets)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  venueId?: string;

  @ManyToOne(() => TicketCategory, (ticketCategory) => ticketCategory.tickets)
  @JoinColumn({ name: 'ticketCategoryId' })
  ticketCategory: TicketCategory;

  @Column()
  ticketCategoryId: string;

  @Column({ nullable: true })
  seatNumber?: string;

  @Column({ unique: true })
  qrCode: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status: TicketStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
