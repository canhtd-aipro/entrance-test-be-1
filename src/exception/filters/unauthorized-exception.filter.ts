import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
import { ErrorCode, errorMessages } from "../error-messages";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter<UnauthorizedException> {
  async catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    res.status(exception.getStatus()).json({
      code: ErrorCode.UNAUTHORIZED,
      message: errorMessages[ErrorCode.UNAUTHORIZED],
      error: host.getArgs()[0].authInfo,
    });
  }
}
