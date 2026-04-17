import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsDate, IsEnum } from "class-validator";
import { ITEMS_MAX_COUNT } from "../../../constants/validation.constant";
import { Priority } from "../../../enums/priority.enum";
import { IsUndefinable } from "../../../utils/decorators/is-undefinable.decorator";
import { ToArray } from "../../../utils/decorators/to-array.decorator";
import { ListQuery } from "../../../utils/dto/list-query.dto";

export class ListCategoriesQuery extends ListQuery {
  @ApiProperty({ required: false, type: Date })
  @IsUndefinable()
  @Type(() => Date)
  @IsDate()
  createdAtFrom?: Date;

  @ApiProperty({ required: false, type: Date })
  @IsUndefinable()
  @Type(() => Date)
  @IsDate()
  createdAtTo?: Date;

  @ApiProperty({ required: false, isArray: true, enum: Priority })
  @IsUndefinable()
  @Type(() => Number)
  @ToArray()
  @IsEnum(Priority, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(ITEMS_MAX_COUNT)
  priorities?: Priority[];
}
