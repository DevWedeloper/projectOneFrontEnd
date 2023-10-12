import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, HttpResponse<unknown>>();

  getCacheResponse<T>(request: HttpRequest<T>): Observable<HttpResponse<T>> | null {
    const cachedResponse = this.cache.get(request.urlWithParams);
    return cachedResponse ? of(cachedResponse as HttpResponse<T>) : null;
  }

  cacheResponse<T>(request: HttpRequest<T>, response: HttpResponse<T>): void {
    this.cache.set(request.urlWithParams, response);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
