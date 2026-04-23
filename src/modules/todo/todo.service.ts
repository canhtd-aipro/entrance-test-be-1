import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { CategoryEntity } from "../../database/entities/category.entity";
import { TodoEntity } from "../../database/entities/todo.entity";
import { DeleteBody } from "../../utils/dto/delete-body.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { updateEntity } from "../../utils/update-entity.util";
import { CreateTodoBody } from "./dto/create-todo-body.dto";
import { ListTodosQuery } from "./dto/list-todos-query.dto";
import { UpdateTodoBody } from "./dto/update-todo-body.dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepo: Repository<TodoEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async list(query: ListTodosQuery) {
    const { keyword, take, skip } = query;
    const whereCondition = keyword ? { name: ILike(toSearchString(keyword)) } : {};

    const [todos, total] = await Promise.all([
      this.todoRepo
        .createQueryBuilder("todo")
        .leftJoin("todo.categories", "orderCategory")
        .groupBy("todo.id")
        .orderBy("COALESCE(SUM(orderCategory.priority), 0)", "DESC")
        .addOrderBy("todo.id", "DESC")
        .setFindOptions({
          where: whereCondition,
          relationLoadStrategy: "query",
          relations: { categories: true },
        })
        .limit(take)
        .offset(skip)
        .getMany(),
      this.todoRepo.count({ where: whereCondition }),
    ]);

    return { todos, total };
  }

  async detail(id: number) {
    const todo = await this.todoRepo.findOneOrFail({
      where: { id },
      relations: { categories: true },
    });
    return { todo };
  }

  async create(body: CreateTodoBody) {
    await this.todoRepo.save(this.todoRepo.create(body));
  }

  async update(id: number, body: UpdateTodoBody) {
    const todo = await this.todoRepo.findOneOrFail({
      where: { id },
      relations: { categories: true },
    });
    updateEntity(todo, body);
    await this.todoRepo.save(todo);
  }

  async delete(body: DeleteBody) {
    await this.todoRepo.delete(body.ids);
  }
}
