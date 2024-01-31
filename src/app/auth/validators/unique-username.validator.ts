import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { UserApiService } from '../data-access/user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UniqueUsernameValidator {
  private userApiService = inject(UserApiService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.getRawValue() === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((username) =>
        this.userApiService.isUsernameUnique(username).pipe(
          map((response) =>
            response.message === 'Username is unique'
              ? null
              : { uniqueName: true },
          ),
          catchError(() => of(null)),
        ),
      ),
    );
  }
}
