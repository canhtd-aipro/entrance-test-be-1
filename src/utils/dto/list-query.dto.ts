import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";
import { IsUndefinable } from "../decorators/is-undefinable.decorator";
import { Trim } from "../decorators/trim.decorator";

export class ListQuery {
  @ApiProperty({ required: false })
  @IsUndefinable()
  @Trim()
  @IsString()
  keyword?: string;

  @ApiProperty({ required: false, type: "number" })
  @IsUndefinable()
  @Type(() => Number)
  @IsInt()
  take?: number = 10;

  @ApiProperty({ required: false, type: "number" })
  @IsUndefinable()
  @Type(() => Number)
  @IsInt()
  skip?: number = 0;
}
