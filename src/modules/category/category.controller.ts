import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteBody } from "../../utils/dto/delete-body.dto";
import { IdParam } from "../../utils/dto/id-param.dto";
import { CategoryService } from "./category.service";
import { CreateCategoryBody } from "./dto/create-category-body.dto";
import { ListCategoriesQuery } from "./dto/list-categories-query.dto";
import { UpdateCategoryBody } from "./dto/update-category-body.dto";

@Controller("categories")
@ApiTags("categories")
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Post("/")
  async create(@Body() body: CreateCategoryBody) {
    return this.service.create(body);
  }

  @Get("/")
  async list(@Query() query: ListCategoriesQuery) {
    return this.service.list(query);
  }

  @Get("/:id")
  async detail(@Param() { id }: IdParam) {
    return this.service.detail(id);
  }

  @Put("/:id")
  async update(@Param() { id }: IdParam, @Body() body: UpdateCategoryBody) {
    return this.service.update(id, body);
  }

  @Delete("/")
  async delete(@Body() body: DeleteBody) {
    return this.service.delete(body);
  }
}
