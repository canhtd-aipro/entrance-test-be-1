import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { merge } from "lodash";
import { Between, FindManyOptions, ILike, In, Repository } from "typeorm";
import { CategoryEntity } from "../../database/entities/category.entity";
import { DeleteBody } from "../../utils/dto/delete-body.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { updateEntity } from "../../utils/update-entity.util";
import { CreateCategoryBody } from "./dto/create-category-body.dto";
import { ListCategoriesQuery } from "./dto/list-categories-query.dto";
import { UpdateCategoryBody } from "./dto/update-category-body.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async list(query: ListCategoriesQuery) {
    const { keyword, take, skip, createdAtFrom, createdAtTo, priorities } = query;

    const options: FindManyOptions<CategoryEntity> = {
      where: {},
      order: { id: "DESC" },
      take,
      skip,
    };

    if (keyword) {
      merge(options, { where: { name: ILike(toSearchString(keyword)) } });
    }
    if (priorities) {
      merge(options, { where: { priority: In(priorities) } });
    }
    if (createdAtFrom && createdAtTo) {
      merge(options, { where: { createdAt: Between(createdAtFrom, createdAtTo) } });
    }

    const [categories, total] = await this.categoryRepo.findAndCount(options);

    return { categories, total };
  }

  async detail(id: number) {
    const category = await this.categoryRepo.findOneOrFail({
      where: { id },
    });
    return { category };
  }

  async create(body: CreateCategoryBody) {
    await this.categoryRepo.save(this.categoryRepo.create(body));
  }

  async update(id: number, body: UpdateCategoryBody) {
    const category = await this.categoryRepo.findOneOrFail({
      where: { id },
    });
    updateEntity(category, body);
    await this.categoryRepo.save(category);
  }

  async delete(body: DeleteBody) {
    await this.categoryRepo.delete(body.ids);
  }
}
