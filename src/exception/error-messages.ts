export enum ErrorCode {
  // system errors
  UNKNOWN = "999999",
  VALIDATION = "999422",
  FORBIDDEN = "999403",
  UNAUTHORIZED = "999401",
}

export const errorMessages: Record<ErrorCode, string> = {
  // system
  "999999": "Unknown error",
  "999422": "Validation error",
  "999403": "Forbidden",
  "999401": "Unauthorized",
};
