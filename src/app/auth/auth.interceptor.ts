import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthApiService } from './data-access/auth-api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authApiService = inject(AuthApiService);

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.error === 'TokenExpiredError: jwt expired') {
          return this.authApiService.refreshToken().pipe(
            switchMap(() => next.handle(request.clone())),
            catchError((error) => throwError(() => error)),
          );
        } else {
          return throwError(() => error);
        }
      }),
    );
  }
}
