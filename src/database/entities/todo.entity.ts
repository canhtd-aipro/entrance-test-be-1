import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { CategoryEntity } from "./category.entity";

@Entity("todos")
export class TodoEntity extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "timestamptz", nullable: true })
  deadline: Date | null;

  @ManyToMany(() => CategoryEntity, {
    cascade: true,
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinTable({
    name: "todo_categories",
    joinColumn: { name: "todoId" },
    inverseJoinColumn: { name: "categoryId" },
  })
  categories: CategoryEntity[];
}
