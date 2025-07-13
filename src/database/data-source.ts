import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Court } from '../entities/Court';
import { Booking } from '../entities/Booking';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', //fake
  password: 'sua_senha', //fake
  database: 'beach_agenda', //fake
  synchronize: true, // somente em dev!
  logging: false,
  entities: [User, Court, Booking],
  migrations: [],
  subscribers: [],
});