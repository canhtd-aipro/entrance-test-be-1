import { randomInt } from "crypto";

export const randomDigitsSet = (length: number) => {
  const digits = "0123456789";

  let set = "";
  for (let i = 0; i < length; i++) {
    set += digits[randomInt(digits.length - 1)];
  }

  return set;
};
