import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CacheService } from './cache.service';

export function cacheInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const cacheService = inject(CacheService);

  if (req.method !== 'GET') {
    cacheService.clearCache();
    return next(req);
  }

  const cachedResponse = cacheService.getCacheResponse(req);
  if (cachedResponse) {
    return cachedResponse;
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.cacheResponse(req, event);
      }
    }),
  );
}
