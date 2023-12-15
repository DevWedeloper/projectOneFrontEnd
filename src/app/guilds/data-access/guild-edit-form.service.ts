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
import { CheckIfMemberApiService } from 'src/app/guilds/data-access/check-if-member-api.service';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';

@Injectable({
  providedIn: 'root',
})
export class GuildEditFormService {
  fb = inject(FormBuilder);
  checkUniquenessApi = inject(CheckUniquenessService);
  checkIfMemberApi = inject(CheckIfMemberApiService);
  updateNameValidationStatus$ = new BehaviorSubject<boolean>(false);
  updateLeaderValidationStatus$ = new BehaviorSubject<boolean>(false);
  ifMemberValidationStatus$ = new BehaviorSubject<boolean>(false);
  addMemberValidationStatus$ = new BehaviorSubject<boolean>(false);
  ifNotMemberValidationStatus$ = new BehaviorSubject<boolean>(false);
  initialName$ = new BehaviorSubject<string>('');
  initialLeader$ = new BehaviorSubject<string>('');

  initializeUpdateNameForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
        [this.validateGuildNameUniqueness.bind(this)],
      ],
    });
  }

  initializeUpdateLeaderForm(guild: string | null): FormGroup {
    return this.fb.group({
      leader: [
        '',
        [Validators.required],
        [
          this.validateLeaderExisting.bind(this),
          (control) => this.checkIfMember(control, guild),
        ],
      ],
    });
  }

  initializeAddMemberForm(guild: string | null): FormGroup {
    return this.fb.group({
      member: [
        '',
        [Validators.required],
        [
          this.validateAddMemberExisting.bind(this),
          (control) => this.checkIfNotMember(control, guild),
        ],
      ],
    });
  }

  private validateGuildNameUniqueness(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const nameField = control.getRawValue();
    if (nameField === this.initialName$.value) {
      return of(null);
    }

    this.updateNameValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkUniquenessApi.checkGuildNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Guild name is unique'
              ? null
              : { uniqueName: true }
          ),
          catchError(() => {
            return of(null);
          })
        )
      ),
      finalize(() => this.updateNameValidationStatus$.next(false))
    );
  }

  private validateLeaderExisting(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const nameField = control.getRawValue();
    if (nameField === this.initialLeader$.value) {
      return of(null);
    }

    this.updateLeaderValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(500),
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
      debounceTime(500),
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

  private checkIfMember(
    control: AbstractControl,
    guild: string | null
  ): Observable<ValidationErrors | null> {
    if (!guild) {
      return of(null);
    }

    const nameField = control.getRawValue();
    if (nameField === this.initialLeader$.value) {
      return of(null);
    }
    
    this.ifMemberValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkIfMemberApi.checkIfMember(name, guild).pipe(
          map((response) => {
            return response.message === 'Not member'
              ? { notMember: true }
              : null;
          }),
          catchError(() => {
            return of(null);
          })
        )
      ),
      finalize(() => this.ifMemberValidationStatus$.next(false))
    );
  }

  private checkIfNotMember(
    control: AbstractControl,
    guild: string | null
  ): Observable<ValidationErrors | null> {
    if (!guild) {
      return of(null);
    }

    this.ifNotMemberValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkIfMemberApi.checkIfMember(name, guild).pipe(
          map((response) => {
            return response.message === 'Member'
              ? { alreadyMember: true }
              : null;
          }),
          catchError(() => {
            return of(null);
          })
        )
      ),
      finalize(() => this.ifNotMemberValidationStatus$.next(false))
    );
  }
}
