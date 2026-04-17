import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "../../database/entities/category.entity";
import { TodoEntity } from "../../database/entities/todo.entity";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity, CategoryEntity])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
