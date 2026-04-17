import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { initializeTransactionalContext } from "typeorm-transactional";
import { AppModule } from "./app.module";
import { validationExceptionFactory } from "./exception/factories/validation-exception.factory";
import { AxiosErrorFilter } from "./exception/filters/axios-error.filter";
import { HttpExceptionFilter } from "./exception/filters/http-exception.filter";
import { UnauthorizedExceptionFilter } from "./exception/filters/unauthorized-exception.filter";
import { UncaughtExceptionFilter } from "./exception/filters/uncaught-exception.filter";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import "./utils/extensions.util";

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors();

  app.use(cookieParser());
  app.useBodyParser("json", { limit: "50mb" });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(
    app.get(UncaughtExceptionFilter),
    app.get(HttpExceptionFilter),
    app.get(UnauthorizedExceptionFilter),
    app.get(AxiosErrorFilter),
  );

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Daimaru BE")
      .setDescription("Sample API of Daimaru BE")
      .addBearerAuth()
      .addSecurityRequirements("bearer")
      .build(),
  );

  SwaggerModule.setup("/api", app, doc, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 3000;
  await app.listen(port);
  console.log(`View documents at: http://localhost:${port}/api`);
}

bootstrap();

process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e);
});
process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection", e);
});
