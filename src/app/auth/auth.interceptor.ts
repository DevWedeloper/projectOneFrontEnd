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
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    if (this.authService.isAuthenticated() && request.method !== 'GET') {
      request = this.addAuthToken(request, this.authService.getAccessToken());
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.isAuthenticated()) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              request = this.addAuthToken(
                request,
                this.authService.getAccessToken()
              );
              return next.handle(request);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addAuthToken<T>(
    request: HttpRequest<T>,
    token: string | null
  ): HttpRequest<T> {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }
}
