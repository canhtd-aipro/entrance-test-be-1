export const toCircledNumber = (n: number): string => {
  const baseCharCode = 9311; // ① is U+2460 = 9312
  if (n >= 1 && n <= 20) {
    return String.fromCharCode(baseCharCode + n);
  }
  return n.toString(); // fallback if out of range
};
