import { Transform } from "class-transformer";

export const ToStringOrNull = () => {
  return Transform(({ value }) => (value === "" || value === null ? null : value));
};
