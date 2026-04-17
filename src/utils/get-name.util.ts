import { randomInt } from "crypto";
import { config } from "dotenv";
config();

export const getIndexName = (id: number) => {
  return `${process.env.PREFIX_INDEX_NAME}-${id}`;
};

export const getS3Directory = (id: number) => {
  return `${process.env.PREFIX_S3_DIRECTORY}-${id}/`;
};

export const getServiceAccountId = (id: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const uniqueSuffix = [...Array(8)].map(() => chars[randomInt(36)]).join("");
  return `${process.env.PREFIX_GOOGLE_SERVICE_ACCOUNT}-${id}-${uniqueSuffix}`;
};
