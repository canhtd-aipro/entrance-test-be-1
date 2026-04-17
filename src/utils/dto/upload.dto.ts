import { MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";
import { fileExceptionFactory } from "../../exception/factories/file-exception.factory";
import { mbToBytes } from "../mb-to-bytes.util";

export class UploadBody {
  @ApiProperty({ type: "string", format: "binary" })
  @Allow()
  file: any;
}

export const uploadFilePipe = new ParseFilePipe({
  validators: [new MaxFileSizeValidator({ maxSize: mbToBytes(1050) })],
  exceptionFactory: fileExceptionFactory,
});
