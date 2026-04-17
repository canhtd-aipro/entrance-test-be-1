import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteBody } from "../../utils/dto/delete-body.dto";
import { IdParam } from "../../utils/dto/id-param.dto";
import { TodoService } from "./todo.service";
import { CreateTodoBody } from "./dto/create-todo-body.dto";
import { ListTodosQuery } from "./dto/list-todos-query.dto";
import { UpdateTodoBody } from "./dto/update-todo-body.dto";

@Controller("todos")
@ApiTags("todos")
export class TodoController {
  constructor(private service: TodoService) {}

  @Post("/")
  async create(@Body() body: CreateTodoBody) {
    return this.service.create(body);
  }

  @Get("/")
  async list(@Query() query: ListTodosQuery) {
    return this.service.list(query);
  }

  @Get("/:id")
  async detail(@Param() { id }: IdParam) {
    return this.service.detail(id);
  }

  @Put("/:id")
  async update(@Param() { id }: IdParam, @Body() body: UpdateTodoBody) {
    return this.service.update(id, body);
  }

  @Delete("/")
  async delete(@Body() body: DeleteBody) {
    return this.service.delete(body);
  }
}
