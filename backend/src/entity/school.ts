import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Class } from "./class";
import { Teacher } from "./teacher";
import { Student } from "./student";
import { User } from "./user";
@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  school_name!: string;

  @Column()
  address!: string;

  @OneToMany(() => Class, (cls) => cls.school)
  classes!: Class[];

  @OneToMany(() => Teacher, (teacher) => teacher.school)
  teachers!: Teacher[];

  @OneToMany(() => Student, (student) => student.school)
  students!: Student[];

  @OneToMany(() => User, (user) => user.school)
  users!: User[];
}
