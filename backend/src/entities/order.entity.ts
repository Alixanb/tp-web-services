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
import { Ticket } from './ticket.entity';
import { User } from './user.entity';
import { OrderStatus } from 'src/common/enum/role.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  orderDate: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @OneToMany(() => Ticket, (ticket) => ticket.order)
  tickets: Ticket[];

  @BeforeInsert()
  @BeforeUpdate()
  mapTicketVenue() {
    if (this.tickets) {
      for (const ticket of this.tickets) {
        if (!ticket.venueId && ticket.event?.venueId) {
          ticket.venueId = ticket.event.venueId;
        }
      }
    }
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
