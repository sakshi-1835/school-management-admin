import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { School } from "./school";
import { Section } from "./section";
import { Student } from "./student";

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  class_name!: string;

  @ManyToOne(() => School, (school) => school.classes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "school_id" })
  school!: School;

  @OneToMany(() => Section, (section) => section.classObj)
  sections!: Section[];

  @OneToMany(() => Student, (student) => student.classObj)
  students!: Student[];
}