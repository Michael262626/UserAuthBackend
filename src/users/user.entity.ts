// src/users/user.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  resetToken: string

  @Column({ nullable: true })
  resetTokenExpiry: Date

  @Column({ default: 'user' })
  role: string;
}
