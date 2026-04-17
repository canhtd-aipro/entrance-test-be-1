import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { TEXTBOX_MAX_LENGTH } from "../../../constants/validation.constant";
import { IsUndefinable } from "../../../utils/decorators/is-undefinable.decorator";
import { ItemDto } from "../../../utils/dto/item.dto";

export class CreateTodoBody {
  @ApiProperty({})
  @IsString()
  @Length(1, TEXTBOX_MAX_LENGTH)
  name: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date | null;

  @ApiProperty({ required: false, type: ItemDto, isArray: true })
  @IsUndefinable()
  @Type(() => ItemDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  categories?: ItemDto[];
}
