export const formatDecimalNumber = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || amount === "") return "";

  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
