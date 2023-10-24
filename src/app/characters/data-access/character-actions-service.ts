import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  forkJoin,
  switchMap,
  tap,
} from 'rxjs';
import { CharacterApiService } from 'src/app/shared/data-access/character-api.service';
import { ErrorService } from 'src/app/shared/data-access/error.service';
import { Character } from 'src/app/shared/interfaces/character.interface';
import {
  isLeaderOfAGuild,
  isMemberOfAGuild,
  isNotMemberOfAGuild,
} from 'src/app/shared/utils/guild-membership-status.utils';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterActionsService {
  cs = inject(CharacterService);
  characterApiService = inject(CharacterApiService);
  es = inject(ErrorService);
  characterCreate$ = new Subject<FormGroup>();
  characterUpdate$ = new Subject<{
    characterForm: FormGroup;
    previousCharacterData: Character;
  }>();
  characterJoinGuild$ = new Subject<{
    character: Character;
    joinGuildForm: FormGroup;
  }>();
  characterLeaveGuild$ = new Subject<{
    character: Character;
    joinGuildForm: FormGroup;
  }>();
  characterDelete$ = new Subject<Character>();
  characterToUpdate$ = new BehaviorSubject<Character | null>(null);
  createLoading$ = new BehaviorSubject<boolean>(false);
  updateLoading$ = new BehaviorSubject<boolean>(false);
  joinLoading$ = new BehaviorSubject<boolean>(false);
  leaveLoading$ = new BehaviorSubject<boolean>(false);
  deleteLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.characterCreate$
      .pipe(
        tap(() => this.createLoading$.next(true)),
        switchMap((characterForm) => {
          return this.characterApiService
            .createCharacter(characterForm.value)
            .pipe(
              tap(() => {
                characterForm.reset();
                characterForm.get('characterType')?.setValue('');
              }),
              catchError((error) => {
                if (this.es.handleDuplicateKeyError(error)) {
                  characterForm.get('name')?.setErrors({ uniqueName: true });
                }
                this.createLoading$.next(false);
                return EMPTY;
              })
            );
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.cs.refetchPage$.next();
        this.createLoading$.next(false);
      });

    this.characterUpdate$
      .pipe(
        tap(() => this.updateLoading$.next(true)),
        switchMap(({ characterForm, previousCharacterData }) => {
          if (!characterForm.valid) {
            return EMPTY;
          }

          const updatedCharacterData = characterForm.value;
          const attributesToUpdate: {
            attribute: string;
            attributeValue: string | number;
          }[] = [];

          for (const attribute in updatedCharacterData) {
            if (attribute in updatedCharacterData) {
              const attributeValue = updatedCharacterData[attribute];
              const originalAttributeValue =
                previousCharacterData[attribute as keyof Character];

              if (attributeValue !== originalAttributeValue) {
                attributesToUpdate.push({ attribute, attributeValue });
              }
            }
          }

          const observables = attributesToUpdate.map(
            ({ attribute, attributeValue }) => {
              return this.characterApiService
                .updateCharacterAttributeById(
                  previousCharacterData._id,
                  attributeValue,
                  attribute
                )
                .pipe(
                  catchError((error) => {
                    if (this.es.handleDuplicateKeyError(error)) {
                      characterForm
                        .get('name')
                        ?.setErrors({ uniqueName: true });
                    }
                    this.updateLoading$.next(false);
                    return EMPTY;
                  })
                );
            }
          );

          if (observables.length === 0) {
            this.updateLoading$.next(false);
          }

          return forkJoin(observables);
        }),
        tap((data) => {
          this.characterToUpdate$.next(data[data.length - 1].character);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.cs.refetchPage$.next();
        this.updateLoading$.next(false);
      });

    this.characterJoinGuild$
      .pipe(
        tap(() => this.joinLoading$.next(true)),
        switchMap(({ character, joinGuildForm }) => {
          if (isMemberOfAGuild(character)) {
            if (
              !confirm(
                'This character has a guild, proceeding would remove it from the guild, are you sure?'
              )
            ) {
              this.joinLoading$.next(false);
              return EMPTY;
            }
          }
          if (isLeaderOfAGuild(character)) {
            if (
              !confirm(
                'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
              this.joinLoading$.next(false);
              return EMPTY;
            }
          }
          return this.characterApiService
            .joinGuildById(character._id, joinGuildForm.value.guild)
            .pipe(
              catchError((error) => {
                if (this.es.handleAlreadyMemberError(error)) {
                  joinGuildForm
                    .get('guild')
                    ?.setErrors({ alreadyMember: true });
                } else {
                  joinGuildForm.get('guild')?.setErrors({ notFound: true });
                }
                this.joinLoading$.next(false);
                return EMPTY;
              })
            );
        }),
        tap((data) => {
          this.characterToUpdate$.next(data.character);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.cs.refetchPage$.next();
        this.joinLoading$.next(false);
      });

    this.characterLeaveGuild$
      .pipe(
        tap(() => this.leaveLoading$.next(true)),
        switchMap(({ character, joinGuildForm }) => {
          if (isLeaderOfAGuild(character)) {
            if (
              !confirm(
                'This character is the leader of this guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
              this.leaveLoading$.next(false);
              return EMPTY;
            }
          }
          return this.characterApiService
            .leaveGuildById(character._id)
            .pipe(tap(() => joinGuildForm.reset()));
        }),
        tap((data) => {
          this.characterToUpdate$.next(data.character);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.cs.refetchPage$.next();
        this.leaveLoading$.next(false);
      });

    this.characterDelete$
      .pipe(
        tap((character) => {
          this.deleteLoading$.next(true);
          this.characterToUpdate$.next(character);
        }),
        switchMap((character) => {
          if (isNotMemberOfAGuild(character)) {
            if (!confirm('Are you sure you want to delete this character?')) {
              this.deleteLoading$.next(false);
              return EMPTY;
            }
          }
          if (isMemberOfAGuild(character)) {
            if (
              !confirm(
                'This character has a guild, proceeding would remove it from the guild, are you sure?'
              )
            ) {
              this.deleteLoading$.next(false);
              return EMPTY;
            }
          }
          if (isLeaderOfAGuild(character)) {
            if (
              !confirm(
                'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
              this.deleteLoading$.next(false);
              return EMPTY;
            }
          }
          return this.characterApiService.deleteCharacterById(character._id);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.cs.refetchPage$.next();
      });
  }
}
