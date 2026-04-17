export const enumValues = (_enum: Record<string, number | string>) =>
  Object.values(_enum).filter((e) => typeof e === "number");
