import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { UserApiService } from '../data-access/user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UniqueEmailValidator {
  private userApiService = inject(UserApiService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.getRawValue() === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((email) =>
        this.userApiService.isEmailUnique(email).pipe(
          map((response) =>
            response.message === 'Email is unique'
              ? null
              : { uniqueName: true },
          ),
          catchError(() => {
            return of(null);
          }),
        ),
      ),
    );
  }
}
