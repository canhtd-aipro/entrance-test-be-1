import { Transform } from "class-transformer";

export const ToNumberOrNull = () => {
  return Transform(({ value }) => (value === "" || value === null ? null : Number(value)));
};
