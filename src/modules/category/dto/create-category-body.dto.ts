import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsString, Length } from "class-validator";
import { TEXTBOX_MAX_LENGTH } from "../../../constants/validation.constant";
import { Priority } from "../../../enums/priority.enum";

export class CreateCategoryBody {
  @ApiProperty({})
  @IsString()
  @Length(1, TEXTBOX_MAX_LENGTH)
  name: string;

  @ApiProperty({ required: false, enum: Priority })
  @Type(() => Number)
  @IsEnum(Priority)
  priority: Priority;
}
