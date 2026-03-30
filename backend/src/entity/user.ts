import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { School } from "./school";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  SCHOOL_ADMIN = "SCHOOL_ADMIN",
}

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

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.SCHOOL_ADMIN,
  })
  role!: UserRole;

  @ManyToOne(() => School, (school) => school.users, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "school_name" })
  school!: School | null;
}
