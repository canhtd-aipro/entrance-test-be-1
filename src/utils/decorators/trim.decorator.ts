import { Transform } from "class-transformer";

export type TrimOptions = {
  each?: boolean;
};

export const Trim = (options?: TrimOptions) => {
  const transform = (value: unknown) => {
    if (typeof value !== "string") {
      return value;
    }
    return value.trim();
  };

  return Transform(({ value }) => {
    if (options?.each && Array.isArray(value)) {
      return value.map(transform);
    }
    return transform(value);
  });
};
