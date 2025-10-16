import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';
import { Venue } from './venue.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('timestamp')
  eventDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  availableTickets: number;

  @Column('int')
  totalTickets: number;

  @ManyToOne(() => User, (user) => user.organizedEvents)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column()
  organizerId: string;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column()
  venueId: string;

  @ManyToOne(() => Category, (category) => category.events)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;
}
