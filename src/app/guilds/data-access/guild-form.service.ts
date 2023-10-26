import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
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
export class GuildFormService {
  fb = inject(FormBuilder);
  checkUniquenessApi = inject(CheckUniquenessService);
  guildNameValidationStatus$ = new BehaviorSubject<boolean>(false);
  leaderValidationStatus$ = new BehaviorSubject<boolean>(false);

  initializeGuildForm() {
    return this.fb.group({
      name: [
        '',
        [Validators.required, validateName],
        [this.validateGuildNameUniqueness.bind(this)],
      ],
      leader: [
        '',
        [Validators.required],
        [this.validateLeaderExisting.bind(this)],
      ],
    });
  }

  private validateGuildNameUniqueness(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    this.guildNameValidationStatus$.next(true);
    return of(control.value).pipe(
      debounceTime(500),
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
      finalize(() => this.guildNameValidationStatus$.next(false))
    );
  }

  private validateLeaderExisting(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    this.leaderValidationStatus$.next(true);
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
      finalize(() => this.leaderValidationStatus$.next(false))
    );
  }
}
