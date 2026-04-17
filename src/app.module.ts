import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "express";
import { ClsModule } from "nestjs-cls";
import { DataSource } from "typeorm";
import { addTransactionalDataSource, deleteDataSourceByName } from "typeorm-transactional";
import { entities } from "./database";
import { options } from "./database/orm.config";
import { ExceptionModule } from "./exception/exception.module";
import { I18nModule } from "./i18n/i18n.module";
import { LoggerModule } from "./logger/logger.module";
import { CategoryModule } from "./modules/category/category.module";
import { TodoModule } from "./modules/todo/todo.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    TypeOrmModule.forRootAsync({
      useFactory() {
        return options;
      },
      async dataSourceFactory(options) {
        deleteDataSourceByName("default");
        return addTransactionalDataSource(new DataSource(options!));
      },
    }),
    TypeOrmModule.forFeature(entities),
    ExceptionModule,
    I18nModule,
    CategoryModule,
    TodoModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup(cls, req: Request) {
          cls.set("locale", req.cookies.locale);
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
