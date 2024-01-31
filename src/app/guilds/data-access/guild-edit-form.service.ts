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
import { CheckIfMemberApiService } from 'src/app/guilds/data-access/check-if-member-api.service';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';
import { alphanumericUnderscore } from 'src/app/shared/validators/alphanumeric-underscore.validator';

@Injectable({
  providedIn: 'root',
})
export class GuildEditFormService {
  private fb = inject(FormBuilder);
  private checkUniquenessApi = inject(CheckUniquenessService);
  private checkIfMemberApi = inject(CheckIfMemberApiService);
  initialName$ = new BehaviorSubject<string>('');
  initialLeader$ = new BehaviorSubject<string>('');

  initializeUpdateNameForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            alphanumericUnderscore,
          ],
          asyncValidators: [this.validateGuildNameUniqueness.bind(this)],
          updateOn: 'blur',
        },
      ],
    });
  }

  initializeUpdateLeaderForm(guild: string | null): FormGroup {
    return this.fb.group({
      leader: [
        '',
        {
          asyncValidators: (control: AbstractControl) =>
            this.checkIfMember(control, guild),
          updateOn: 'blur',
        },
      ],
    });
  }

  initializeAddMemberForm(guild: string | null): FormGroup {
    return this.fb.nonNullable.group({
      member: [
        '',
        {
          asyncValidators: (control: AbstractControl) =>
            this.checkIfNotMember(control, guild),
          updateOn: 'blur',
        },
      ],
    });
  }

  private validateGuildNameUniqueness(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
    const nameField = control.getRawValue();
    if (nameField === this.initialName$.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkUniquenessApi.checkGuildNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Guild name is unique'
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

  private checkIfMember(
    control: AbstractControl,
    guild: string | null,
  ): Observable<ValidationErrors | null> {
    if (!guild) {
      return of(null);
    }

    const nameField = control.getRawValue();
    if (nameField === this.initialLeader$.value || nameField === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkIfMemberApi.isNotMember(name, guild).pipe(
          map((response) => {
            return response.message === 'Not member'
              ? { notMember: true }
              : null;
          }),
          catchError(() => {
            return of(null);
          }),
        ),
      ),
    );
  }

  private checkIfNotMember(
    control: AbstractControl,
    guild: string | null,
  ): Observable<ValidationErrors | null> {
    if (!guild) {
      return of(null);
    }

    const nameField = control.getRawValue();
    if (nameField === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkIfMemberApi.isMember(name, guild).pipe(
          map((response) => {
            return response.message === 'Member'
              ? { alreadyMember: true }
              : null;
          }),
          catchError(() => {
            return of(null);
          }),
        ),
      ),
    );
  }
}
