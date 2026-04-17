import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ErrorCode, errorMessages } from "../error-messages";
import { AxiosError } from "axios";

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter<AxiosError> {
  async catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    res.status(500).json({
      code: ErrorCode.UNKNOWN,
      message: errorMessages[ErrorCode.UNKNOWN],
      error: {
        type: "AxiosError",
        statusCode: exception.response?.status,
        data: exception.response?.data,
      },
    });
  }
}
