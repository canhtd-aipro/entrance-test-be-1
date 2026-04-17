import { config } from "dotenv";
import Redis from "ioredis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../constants/env-key.constant";

config();

export const redisClient = new Redis({
  host: process.env[REDIS_HOST],
  port: Number(process.env[REDIS_PORT]),
  password: process.env[REDIS_PASSWORD],
  lazyConnect: true,
});
