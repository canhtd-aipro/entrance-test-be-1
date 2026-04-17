import { ValidationError } from "@nestjs/common";
import { ErrorCode } from "../error-messages";
import { AppException } from "../app.exception";

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const mapError = (error: ValidationError): ValidationError => {
    const { property, constraints, contexts, children } = error;
    return { property, constraints, contexts, children: children?.map(mapError) };
  };
  const customErrors = errors.map(mapError);
  return new AppException(ErrorCode.VALIDATION, 422, customErrors);
};
