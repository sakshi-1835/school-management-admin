import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Class } from "./class";
import { Teacher } from "./teacher";
import { Student } from "./student";

@Entity()
export class Section {
  [x: string]: any;
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

  @OneToMany(() => Student, (student) => student.section)
  students: Student[] | undefined;
}
