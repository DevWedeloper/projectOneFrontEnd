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
import { validateName } from 'src/app/shared/utils/validate-name.utils';

@Injectable({
  providedIn: 'root',
})
export class GuildEditFormService {
  fb = inject(FormBuilder);
  checkUniquenessApi = inject(CheckUniquenessService);
  updateNameValidationStatus$ = new BehaviorSubject<boolean>(false);
  updateLeaderValidationStatus$ = new BehaviorSubject<boolean>(false);
  addMemberValidationStatus$ = new BehaviorSubject<boolean>(false);
  updateNameInitialValueSet$ = new BehaviorSubject<boolean>(false);
  updateLeaderInitialValueSet$ = new BehaviorSubject<boolean>(false);
  initialName$ = new BehaviorSubject<string>('');
  initialLeader$ = new BehaviorSubject<string>('');

  initializeUpdateNameForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [Validators.required, validateName],
        [this.validateGuildNameUniqueness.bind(this)],
      ],
    });
  }

  initializeUpdateLeaderForm(): FormGroup {
    return this.fb.group({
      leader: [
        '',
        [Validators.required],
        [this.validateLeaderExisting.bind(this)],
      ],
    });
  }

  initializeAddMemberForm(): FormGroup {
    return this.fb.group({
      member: [
        '',
        [Validators.required],
        [this.validateAddMemberExisting.bind(this)],
      ],
    });
  }

  private validateGuildNameUniqueness(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (this.updateNameInitialValueSet$.value) {
      return of(null);
    }

    const nameField = control.getRawValue();
    if (nameField === this.initialName$.value) {
      return of(null);
    }

    this.updateNameValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(300),
      switchMap((name) =>
        this.checkUniquenessApi.checkGuildNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Guild name is unique'
              ? null
              : { uniqueName: false }
          ),
          catchError(() => {
            return of({ uniqueName: true });
          })
        )
      ),
      finalize(() => this.updateNameValidationStatus$.next(false))
    );
  }

  private validateLeaderExisting(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (this.updateLeaderInitialValueSet$.value) {
      return of(null);
    }

    const nameField = control.getRawValue();
    if (nameField === this.initialLeader$.value) {
      return of(null);
    }

    this.updateLeaderValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(300),
      switchMap((name) =>
        this.checkUniquenessApi.checkCharacterNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Character name is unique'
              ? { notFound: true }
              : null
          ),
          catchError(() => {
            return of(null);
          })
        )
      ),
      finalize(() => this.updateLeaderValidationStatus$.next(false))
    );
  }

  private validateAddMemberExisting(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    this.addMemberValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(300),
      switchMap((name) =>
        this.checkUniquenessApi.checkCharacterNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Character name is unique'
              ? { notFound: true }
              : null
          ),
          catchError(() => {
            return of(null);
          })
        )
      ),
      finalize(() => this.addMemberValidationStatus$.next(false))
    );
  }
}
