import { join } from "path";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as postgres from "pg";
import { config } from "dotenv";
config();

export const options: PostgresConnectionOptions = {
  type: "postgres",
  driver: postgres,
  synchronize: false,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  poolSize: Number(process.env.DB_POOL_SIZE || 100),
  entities: [join(__dirname, "/entities/*{.ts,.js}")],
  migrations: [join(__dirname, "/migrations/*{.ts,.js}")],
  logging: process.env.SQL_DEBUG === "true",
};

const dataSource = new DataSource({ ...options });
dataSource.initialize();

export default dataSource;
