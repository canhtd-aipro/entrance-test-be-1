import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export const LengthWithoutHyphens = (min: number, max?: number, validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "LengthWithoutHyphen",
      target: object.constructor,
      propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;
          const normalized = value.replace(/-/g, "");
          const [min, max] = args.constraints;
          const len = normalized.length;
          return len >= min && (max === undefined || len <= max);
        },
        defaultMessage(args: ValidationArguments) {
          const [min, max] = args.constraints;
          return max
            ? `${args.property} must be between ${min} and ${max} characters (excluding hyphens).`
            : `${args.property} must be at least ${min} characters (excluding hyphens).`;
        },
      },
    });
  };
};
