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
import { isLeaderOfAGuild, isMemberOfAGuild, isNotMemberOfAGuild } from 'src/app/shared/utils/guild-membership-status.utils';
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
    characterId: string;
    joinGuildForm: FormGroup;
    selectedGuildId: string;
  }>();
  characterLeaveGuild$ = new Subject<{
    character: Character;
    joinGuildForm: FormGroup;
  }>();
  characterDelete$ = new Subject<Character>();
  characterToUpdate$ = new BehaviorSubject<Character | null>(null);

  constructor() {
    this.characterCreate$
      .pipe(
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
                return EMPTY;
              })
            );
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cs.refetchPage$.next());

    this.characterUpdate$
      .pipe(
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
                    return EMPTY;
                  })
                );
            }
          );

          return forkJoin(observables);
        }),
        tap((data) => {
          this.characterToUpdate$.next(data[data.length - 1].character);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cs.refetchPage$.next());

    this.characterJoinGuild$
      .pipe(
        switchMap(({ characterId, joinGuildForm, selectedGuildId }) => {
          return this.characterApiService
            .joinGuildById(characterId, { guild: selectedGuildId })
            .pipe(
              catchError((error) => {
                if (this.es.handleAlreadyMemberError(error)) {
                  joinGuildForm
                    .get('guild')
                    ?.setErrors({ alreadyMember: true });
                } else {
                  joinGuildForm.get('guild')?.setErrors({ notFound: true });
                }
                return EMPTY;
              })
            );
        }),
        tap((data) => {
          this.characterToUpdate$.next(data.character);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cs.refetchPage$.next());

    this.characterLeaveGuild$
      .pipe(
        switchMap(({ character, joinGuildForm }) => {
          if (isLeaderOfAGuild(character)) {
            if (
              !confirm(
                'This character is the leader of this guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
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
      .subscribe(() => this.cs.refetchPage$.next());

    this.characterDelete$
      .pipe(
        switchMap((character) => {
          if (isNotMemberOfAGuild(character)) {
            if (!confirm('Are you sure you want to delete this character?')) {
              return EMPTY;
            }
          }
          if (isMemberOfAGuild(character)) {
            if (
              !confirm(
                'This character has a guild, proceeding would remove it from the guild, are you sure?'
              )
            ) {
              return EMPTY;
            }
          }
          if (isLeaderOfAGuild(character)) {
            if (
              !confirm(
                'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
              return EMPTY;
            }
          }
          return this.characterApiService.deleteCharacterById(character._id);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cs.refetchPage$.next());
  }
}
