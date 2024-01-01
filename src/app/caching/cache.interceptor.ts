import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  cacheService = inject(CacheService);

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    if (request.method !== 'GET') {
      this.cacheService.clearCache();
      return next.handle(request);
    }

    const cachedResponse = this.cacheService.getCacheResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cacheService.cacheResponse(request, event);
        }
      }),
    );
  }
}
