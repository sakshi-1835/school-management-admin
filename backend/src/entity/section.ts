import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Class } from "./class";
import { Teacher } from "./teacher";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  section_name!: string;

  @ManyToOne(() => Class, (cls) => cls.sections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "class_id" })
  classObj!: Class;

  @ManyToOne(() => Teacher, (teacher) => teacher.sections, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "class_teacher_id" })
  classTeacher!: Teacher;
}
