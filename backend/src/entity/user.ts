import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { School } from "./school";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "admin" })
  role!: string;

  @ManyToOne(() => School, (school) => school.users, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "school_name" })
  school!: School;
}
