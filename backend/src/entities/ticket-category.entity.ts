import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';

@Entity('ticket_categories')
export class TicketCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.ticketCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  totalStock: number;

  @Column('int')
  availableStock: number;

  @Column('text', { nullable: true })
  description?: string;

  @OneToMany(() => Ticket, (ticket) => ticket.ticketCategory)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
