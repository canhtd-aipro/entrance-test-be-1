import { Column, Entity, ManyToMany } from "typeorm";
import { Priority } from "../../enums/priority.enum";
import { BaseEntity } from "./_base.entity";
import { TodoEntity } from "./todo.entity";

@Entity("categories")
export class CategoryEntity extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @Column({ type: "smallint" })
  priority: Priority;

  @ManyToMany(() => TodoEntity, (todo) => todo.categories)
  todos: TodoEntity[];
}
