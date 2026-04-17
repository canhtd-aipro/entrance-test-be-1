export const formatMoneyNumber = (amount: number | string | undefined | null): string => {
  if (amount === 0) return "0";

  if (!amount) return "";

  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
