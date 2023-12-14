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
  switchMap,
} from 'rxjs';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterFormService {
  fb = inject(FormBuilder);
  checkUniquenessApi = inject(CheckUniquenessService);
  validationStatus$ = new BehaviorSubject<boolean>(false);
  isInitialValueSet$ = new BehaviorSubject<boolean>(false);
  initialName$ = new BehaviorSubject<string>('');

  initializeCharacterForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
        [this.validateCharacterNameUniqueness.bind(this)],
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
      debounceTime(500),
      switchMap((name) =>
        this.checkUniquenessApi.checkCharacterNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Character name is unique'
              ? null
              : { uniqueName: true }
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
