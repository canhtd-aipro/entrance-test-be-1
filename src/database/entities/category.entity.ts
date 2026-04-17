import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Priority } from "../../enums/priority.enum";
import { BaseEntity } from "./_base.entity";
import { TodoEntity } from "./todo.entity";

@Entity("categories")
export class CategoryEntity extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @Column({ type: "smallint" })
  priority: Priority;

  @ManyToMany(() => TodoEntity, {
    cascade: true,
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinTable({
    name: "todo_categories",
    joinColumn: { name: "categoryId" },
    inverseJoinColumn: { name: "todoId" },
  })
  todos: TodoEntity[];
}
