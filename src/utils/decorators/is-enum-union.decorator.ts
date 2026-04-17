import { registerDecorator, ValidationOptions } from "class-validator";

export const IsEnumUnion = (enums: object[], validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "isEnumUnion",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined) return true;

          const values = enums.flatMap((e) => Object.values(e));
          return values.includes(value);
        },
        defaultMessage() {
          return `${propertyName} must be a valid enum value`;
        },
      },
    });
  };
};
