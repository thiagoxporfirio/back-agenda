import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Court } from './court.entity';
import { User } from './user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  courtId: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 1.0 })
  duration: number; // Duração em horas (0.5, 1.0, 1.5, etc.)

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Court, (court) => court.bookings)
  @JoinColumn({ name: 'courtId' })
  court: Court;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
