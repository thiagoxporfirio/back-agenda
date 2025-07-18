import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
