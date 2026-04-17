export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return phone;

  const cleaned: string = phone.replace(/\D/g, "");

  // Format as XXX...-XXXX-XXXX (first digits - 4 middle digits - 4 last digits)
  if (cleaned.length >= 5) {
    const last4 = cleaned.slice(-4);
    const middle4 = cleaned.slice(-8, -4);
    const first = cleaned.slice(0, -8);

    if (first.length > 0) {
      return `${first}-${middle4}-${last4}`;
    } else {
      // If exactly 8 digits, return as XXXX-XXXX
      return `${middle4}-${last4}`;
    }
  }

  // If less than 8 digits, return original
  return phone;
};
