import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { merge } from "lodash";
import { Between, FindManyOptions, ILike, Repository } from "typeorm";
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
    const { keyword, take, skip, deadlineFrom, deadlineTo, categoryIds, priorities } = query;

    const options: FindManyOptions<TodoEntity> = {
      where: {},
      relationLoadStrategy: "query",
      relations: { categories: true },
      order: { id: "DESC" },
      take,
      skip,
    };

    if (keyword) {
      merge(options, { where: { name: ILike(toSearchString(keyword)) } });
    }

    if (deadlineFrom && deadlineTo) {
      merge(options, { where: { deadline: Between(deadlineFrom, deadlineTo) } });
    }

    const queryBuilder = this.todoRepo.createQueryBuilder("todo").setFindOptions(options);

    // Filter: todos that include at least one of these categories
    if (categoryIds && categoryIds.length > 0) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("tc.todoId")
          .from("todo_categories", "tc")
          .where("tc.categoryId IN (:...categoryIds)")
          .getQuery();
        return `todo.id IN ${subQuery}`;
      });
      queryBuilder.setParameter("categoryIds", categoryIds);
    }

    // Filter: todos that ONLY include categories of these priorities
    // (exclude todos that have any category with a priority NOT in the list)
    if (priorities && priorities.length > 0) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("tc2.todoId")
          .from("todo_categories", "tc2")
          .innerJoin("categories", "c2", "c2.id = tc2.categoryId")
          .where("c2.priority NOT IN (:...priorities)")
          .getQuery();
        return `todo.id NOT IN ${subQuery}`;
      });
      queryBuilder.setParameter("priorities", priorities);
    }

    const [todos, total] = await queryBuilder.getManyAndCount();

    // Sort categories by priority ASC for each todo
    for (const todo of todos) {
      if (todo.categories) {
        todo.categories.sort((a, b) => a.priority - b.priority);
      }
    }

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
