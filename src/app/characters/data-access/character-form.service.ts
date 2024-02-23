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
  map,
  of,
  switchMap,
} from 'rxjs';
import { CheckUniquenessService } from '../../shared/data-access/check-uniqueness-api.service';
import { alphanumericUnderscore } from '../../shared/validators/alphanumeric-underscore.validator';

@Injectable({
  providedIn: 'root',
})
export class CharacterFormService {
  private fb = inject(FormBuilder);
  private checkUniquenessApi = inject(CheckUniquenessService);
  initialName$ = new BehaviorSubject<string>('');

  initializeCharacterForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            alphanumericUnderscore,
          ],
          asyncValidators: [this.validateCharacterNameUniqueness.bind(this)],
          updateOn: 'blur',
        },
      ],
      characterType: ['', [Validators.required]],
      health: [
        null,
        [Validators.required, Validators.min(1000), Validators.max(10000)],
      ],
      strength: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      agility: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      intelligence: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      armor: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      critChance: [
        null,
        [Validators.required, Validators.min(0.01), Validators.max(1)],
      ],
    });
  }

  private validateCharacterNameUniqueness(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
    const nameField = control.getRawValue();
    if (nameField === this.initialName$.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkUniquenessApi.checkCharacterNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Character name is unique'
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
