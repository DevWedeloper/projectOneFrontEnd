import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthApiService } from './data-access/auth-api.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const authApiService = inject(AuthApiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error.error === 'TokenExpiredError: jwt expired') {
        return authApiService.refreshToken().pipe(
          switchMap(() => next(req.clone())),
          catchError((error) => throwError(() => error)),
        );
      } else {
        return throwError(() => error);
      }
    }),
  );
}
