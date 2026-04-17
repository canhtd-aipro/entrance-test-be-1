import { PartialType } from "@nestjs/swagger";
import { CreateCategoryBody } from "./create-category-body.dto";

export class UpdateCategoryBody extends PartialType(CreateCategoryBody) {}
