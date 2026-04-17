import { ClsStore } from "nestjs-cls";

export type AppClsStore = ClsStore & {
  locale?: string;
};
