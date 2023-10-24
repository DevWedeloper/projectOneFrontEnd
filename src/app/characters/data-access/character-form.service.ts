import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of, debounceTime, switchMap, map, catchError, BehaviorSubject, finalize } from 'rxjs';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';
import { validateName } from 'src/app/shared/utils/validate-name.utils';

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
        [Validators.required, validateName],
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
      debounceTime(300),
      switchMap((name) =>
        this.checkUniquenessApi.checkCharacterNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Character name is unique' ? null : { uniqueName: false }
          ),
          catchError(() => {
            return of({ uniqueName: true });
          })
        )
      ),
      finalize(() => this.validationStatus$.next(false))
    );
  }
}
