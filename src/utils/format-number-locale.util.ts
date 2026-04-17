export const formatNumberLocale = (n: number | string | null | undefined): string => {
  if (n === null || n === undefined) {
    return "";
  }
  if (typeof n === "string") {
    if (n === "") {
      return "";
    }
    n = Number(n);
  }

  return n.toLocaleString("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
};
