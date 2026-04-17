import { Transform } from "class-transformer";

export const ToLowerCase = () => {
  return Transform(({ value }) => value?.toLowerCase());
};
