import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface EmptyResponse {
  success: true;
}

type Response<T> = T | EmptyResponse;

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data === undefined) {
          return {
            success: true,
          };
        }
        return data;
      }),
    );
  }
}
