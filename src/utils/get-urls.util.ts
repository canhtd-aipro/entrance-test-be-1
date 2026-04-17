import { config } from "dotenv";
import { FE_APP_URL } from "../constants/env-key.constant";
config();

const feAppUrl = process.env[FE_APP_URL];

export const getResetPasswordUrl = (email: string, digitsCode: string) => {
  return `${feAppUrl}/auth/reset-password?email=${email}&code=${digitsCode}`;
};

export const getLoginUrl = () => {
  return `${feAppUrl}/auth/login`;
};

export const getProjectLandUrl = (id: number) => {
  return `${feAppUrl}/project-lands/${id}`;
};
