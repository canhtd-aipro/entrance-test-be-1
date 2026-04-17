import { Module } from "@nestjs/common";
import { UncaughtExceptionFilter } from "./filters/uncaught-exception.filter";
import { UnauthorizedExceptionFilter } from "./filters/unauthorized-exception.filter";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { AxiosErrorFilter } from "./filters/axios-error.filter";

@Module({
  providers: [UncaughtExceptionFilter, AxiosErrorFilter, UnauthorizedExceptionFilter, HttpExceptionFilter],
  exports: [UncaughtExceptionFilter, AxiosErrorFilter, UnauthorizedExceptionFilter, HttpExceptionFilter],
})
export class ExceptionModule {}
