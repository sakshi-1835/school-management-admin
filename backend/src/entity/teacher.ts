import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { School } from "./school";
import { Section } from "./section";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  subject!: string;

  @ManyToOne(() => School, (school) => school.teachers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "school_id" })
  school!: School;

  @OneToMany(() => Section, (section) => section.classTeacher)
  sections!: Section[];
}