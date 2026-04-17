import { ValidateIf, ValidationOptions } from "class-validator";

export const IsUndefinable = (validationOptions?: ValidationOptions) => {
  return ValidateIf((_, v) => v !== undefined, validationOptions);
};
