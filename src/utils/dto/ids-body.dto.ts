import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsInt } from "class-validator";

export class IdsBody {
  @ApiProperty({ required: true, type: "number", isArray: true })
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  ids: number[];
}
