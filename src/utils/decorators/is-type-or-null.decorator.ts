import { registerDecorator, ValidationOptions } from "class-validator";

export const IsTypeOrNull = (func: (value: unknown) => boolean, options?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isTypeOrNull",
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any) {
          if (value === null) return true; // allow null
          return func(value);
        },
      },
    });
  };
};
