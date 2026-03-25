import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { School } from "./school";
import { Class } from "./class";
import { Section } from "./section";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @ManyToOne(() => School, (school) => school.students, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "school_id" })
  school!: School;

  @ManyToOne(() => Class, (cls) => cls.students, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "class_id" })
  classObj!: Class;

  @ManyToOne(() => Section, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  section!: Section;
}
