import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  details: string;

  @Column()
  ipAddress: string;

  @CreateDateColumn()
  timestamp: Date;
}
