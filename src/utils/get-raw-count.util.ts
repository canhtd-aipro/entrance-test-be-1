import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

declare module "typeorm" {
  // eslint-disable-next-line
  interface SelectQueryBuilder<Entity extends ObjectLiteral> {
    getRawCount(): Promise<number>;
  }
}

SelectQueryBuilder.prototype.getRawCount = async function (this: SelectQueryBuilder<any>) {
  const data = await this.clone().select("COUNT(*)", "cnt").take().skip().offset(0).limit(1).orderBy({}).getRawOne();
  return Number(data.cnt ?? 0);
};
