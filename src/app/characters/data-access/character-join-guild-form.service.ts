import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  catchError,
  debounceTime,
  finalize,
  map,
  of,
  switchMap
} from 'rxjs';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterJoinGuildFormService {
  fb = inject(FormBuilder);
  checkUniquenessApi = inject(CheckUniquenessService);
  validationStatus$ = new BehaviorSubject<boolean>(false);
  isInitialValueSet$ = new BehaviorSubject<boolean>(false);
  initialName$ = new BehaviorSubject<string>('');

  initializeJoinGuildForm(): FormGroup {
    return this.fb.group({
      guild: [
        '',
        [Validators.required],
        [this.validateGuildExisting.bind(this)],
      ]
    });
  }

  private validateGuildExisting(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (this.isInitialValueSet$.value) {
      return of(null);
    }

    const nameField = control.getRawValue();
    if (nameField === this.initialName$.value) {
      return of(null);
    }

    this.validationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(300),
      switchMap((name) =>
        this.checkUniquenessApi.checkGuildNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Guild name is unique'
              ? { guildNotFound: true }
              : null
          ),
          catchError(() => {
            return of(null);
          })
        )
      ),
      finalize(() => this.validationStatus$.next(false))
    );
  }
}
