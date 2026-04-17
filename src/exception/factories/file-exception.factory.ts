import { AppException } from "../app.exception";
import { ErrorCode } from "../error-messages";

export const fileExceptionFactory = (error: string) => {
  return new AppException(ErrorCode.VALIDATION, 422, error);
};
