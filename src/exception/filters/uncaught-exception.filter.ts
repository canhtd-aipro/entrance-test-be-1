import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ErrorCode, errorMessages } from "../error-messages";
import { AppLogger } from "../../logger/logger.service";

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
  constructor(private logger: AppLogger) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    this.logger.error(
      `uncaught ${exception.constructor?.name}\n${exception?.message ?? exception}\n${exception?.stack ?? ""}`,
    );

    res.status(500).json({
      code: ErrorCode.UNKNOWN,
      message: errorMessages[ErrorCode.UNKNOWN],
      error: exception,
      errorMessage: exception.message,
    });
  }
}
