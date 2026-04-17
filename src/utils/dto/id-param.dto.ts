import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class IdParam {
  @ApiProperty({ type: "number" })
  @Type(() => Number)
  @IsInt()
  id: number;
}
