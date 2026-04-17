import { config } from "dotenv";
import { join } from "path";
import "../utils/extensions.util";
import { options } from "./orm.config";

config();

const seederOptions: any = {
  ...options,
  seeds: [join(__dirname, "/seeders/*{.ts,.js}")],
};

export default seederOptions;
