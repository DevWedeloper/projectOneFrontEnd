import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { selectIsCurrentUserAdmin } from './state/auth.reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject(Store);
  private authApiService = inject(AuthApiService);
  isCurrentUserAdmin$ = this.store.select(selectIsCurrentUserAdmin);

  isAuthenticated(): Observable<boolean> {
    return this.authApiService.isLoggedIn().pipe(
      map(() => true),
      catchError(() =>
        this.authApiService.refreshToken().pipe(
          map(() => true),
          catchError(() => of(false)),
        ),
      ),
    );
  }
}
