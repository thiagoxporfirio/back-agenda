import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { User } from './User';
import { Court } from './Court';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings)
  user: User;

  @ManyToOne(() => Court, court => court.bookings)
  court: Court;

  @Column()
  date: string; // YYYY-MM-DD

  @Column()
  time: string; // HH:mm
}