import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { CheckUniquenessService } from 'src/app/shared/data-access/check-uniqueness-api.service';

@Injectable({
  providedIn: 'root',
})
export class GuildFormService {
  private fb = inject(FormBuilder);
  private checkUniquenessApi = inject(CheckUniquenessService);

  initializeGuildForm() {
    return this.fb.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9_]+$/),
          ],
          asyncValidators: [this.validateGuildNameUniqueness.bind(this)],
          updateOn: 'blur',
        },
      ],
      leader: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.validateLeaderExisting.bind(this)],
          updateOn: 'blur',
        },
      ],
    });
  }

  private validateGuildNameUniqueness(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
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

  private validateLeaderExisting(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      debounceTime(500),
      switchMap((name) =>
        this.checkUniquenessApi.checkCharacterNameUniqueness(name).pipe(
          map((response) =>
            response.message === 'Character name is unique'
              ? { notFound: true }
              : null,
          ),
          catchError(() => {
            return of(null);
          }),
        ),
      ),
    );
  }
}
