import { PartialType } from "@nestjs/swagger";
import { CreateTodoBody } from "./create-todo-body.dto";

export class UpdateTodoBody extends PartialType(CreateTodoBody) {}
