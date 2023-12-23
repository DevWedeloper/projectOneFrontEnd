import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  catchError,
  debounceTime,
  map,
  of,
  switchMap,
} from 'rxjs';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterJoinGuildFormService {
  private fb = inject(FormBuilder);
  private checkUniquenessApi = inject(CheckUniquenessService);
  initialName$ = new BehaviorSubject<string>('');

  initializeJoinGuildForm(): FormGroup {
    return this.fb.group({
      guild: [
        null,
        {
          asyncValidators: [this.validateGuildExisting.bind(this)],
          updateOn: 'blur',
        },
      ],
    });
  }

  private validateGuildExisting(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const nameField = control.getRawValue();
    if (nameField === this.initialName$.value || nameField === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkUniquenessApi.checkGuildNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Guild name is unique'
              ? { notFound: true }
              : null
          ),
          catchError(() => {
            return of(null);
          })
        )
      )
    );
  }
}
