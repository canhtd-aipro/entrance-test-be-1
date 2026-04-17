import { HttpException, HttpExceptionOptions } from "@nestjs/common";
import { ErrorCode, errorMessages } from "./error-messages";

export class AppException extends HttpException {
  constructor(code = ErrorCode.UNKNOWN, status = 400, error?: any, options?: HttpExceptionOptions) {
    super(
      {
        code,
        message: errorMessages[code],
        error,
      },
      status,
      options,
    );
  }
}
