import { Transform } from "class-transformer";

export const ToArray = () => {
  return Transform(({ value }) => (Array.isArray(value) ? value : [value]));
};
