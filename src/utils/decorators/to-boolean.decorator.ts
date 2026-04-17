import { Transform } from "class-transformer";

export const ToBoolean = (options?: { optional?: boolean }) => {
  return Transform(({ value }) => {
    if (options?.optional && value === undefined) return undefined;
    return value === "true" || value === "1" || value === 1 || value === true;
  });
};
