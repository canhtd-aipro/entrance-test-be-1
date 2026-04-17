export const toSearchString = (keyword = "") => (keyword ? `%${keyword.replace(/\s+/gi, "%")}%` : "%");
