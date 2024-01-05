import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { CharacterApiService } from 'src/app/shared/data-access/character-api.service';
import { CheckGuildRelationStatusServiceApi } from 'src/app/shared/data-access/check-guild-relation-status.service-api';
import { Character } from 'src/app/shared/interfaces/character.interface';
import {
  isLeaderOfAGuild,
  isMemberOfAGuild,
  isNotMemberOfAGuild,
} from 'src/app/shared/utils/guild-membership-status.utils';
import { CharacterTypeApiService } from '../data-access/character-type-api.service';
import { IsGuildFullApiService } from '../data-access/is-guild-full-api.service';
import { characterActionsActions } from './character-actions.action';
import { characterTableActions } from './character-table.actions';

@Injectable()
export class CharacterActionsEffects {
  private actions$ = inject(Actions);
  private characterApiService = inject(CharacterApiService);
  private isGuildFullApiService = inject(IsGuildFullApiService);
  private checkGuildRelationStatusApiService = inject(
    CheckGuildRelationStatusServiceApi,
  );
  private characterTypeService = inject(CharacterTypeApiService);

  createCharacter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(characterActionsActions.createCharacter),
      switchMap((action) => {
        return this.characterApiService.createCharacter(action.character).pipe(
          map(() => characterActionsActions.createCharacterSuccess()),
          catchError(() =>
            of(characterActionsActions.createCharacterFailure()),
          ),
        );
      }),
    );
  });

  updateCharacter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(characterActionsActions.updateCharacter),
      switchMap((action) => {
        const updatedCharacterData = action.character;
        const previousCharacterData = action.previousCharacterData;
        const attributesToUpdate: {
          attribute: string;
          attributeValue: string | number;
        }[] = [];
        for (const attribute in updatedCharacterData) {
          if (attribute in updatedCharacterData) {
            const attributeValue =
              updatedCharacterData[attribute as keyof Omit<Character, 'guild'>];
            const originalAttributeValue =
              previousCharacterData[attribute as keyof Character];

            if (attributeValue !== originalAttributeValue) {
              attributesToUpdate.push({ attribute, attributeValue });
            }
          }
        }

        const observables = attributesToUpdate.map(
          ({ attribute, attributeValue }) => {
            return this.characterApiService.updateCharacterAttributeById(
              previousCharacterData._id,
              attributeValue,
              attribute,
            );
          },
        );

        return forkJoin(observables);
      }),
      map((data) =>
        characterActionsActions.updateCharacterSuccess({
          selectedCharacter: data[data.length - 1].character,
        }),
      ),
      catchError(() => of(characterActionsActions.updateCharacterFailure())),
    );
  });

  joinGuild$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(characterActionsActions.joinGuild),
      switchMap((action) => {
        const character = action.character;
        const guildName = action.guildName;
        return this.isGuildFullApiService.isGuildFull(guildName).pipe(
          switchMap((data) => {
            if (data.isFull) {
              confirm('Guild is full.');
              return of(characterActionsActions.joinGuildCancel());
            }
            return this.checkGuildRelationStatusApiService
              .checkGuildRelationStatus(character._id)
              .pipe(
                switchMap((data) => {
                  if (
                    data.memberOfGuild &&
                    !confirm(
                      'This character has a guild, proceeding would remove it from the guild, are you sure?',
                    )
                  ) {
                    return of(characterActionsActions.joinGuildCancel());
                  }
                  if (
                    data.leaderOfGuild &&
                    !confirm(
                      'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?',
                    )
                  ) {
                    return of(characterActionsActions.joinGuildCancel());
                  }
                  return this.characterApiService
                    .joinGuildById(character._id, guildName)
                    .pipe(
                      map((data) =>
                        characterActionsActions.joinGuildSuccess({
                          selectedCharacter: data.character,
                        }),
                      ),
                    );
                }),
              );
          }),
        );
      }),
      catchError(() => of(characterActionsActions.joinGuildFailure())),
    );
  });

  leaveGuild$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(characterActionsActions.leaveGuild),
      switchMap((action) => {
        const character = action.character;
        if (isLeaderOfAGuild(character)) {
          if (
            !confirm(
              'This character is the leader of this guild, proceeding would delete its previous guild, are you sure?',
            )
          ) {
            return of(characterActionsActions.joinGuildCancel());
          }
        }
        return this.characterApiService.leaveGuildById(character._id).pipe(
          map((data) =>
            characterActionsActions.leaveGuildSuccess({
              selectedCharacter: data.character,
            }),
          ),
        );
      }),
      catchError(() => of(characterActionsActions.leaveGuildFailure())),
    );
  });

  deleteCharacter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(characterActionsActions.deleteCharacter),
      switchMap((action) => {
        const character = action.character;
        if (isNotMemberOfAGuild(character)) {
          if (!confirm('Are you sure you want to delete this character?')) {
            return of(characterActionsActions.deleteCharacterCancel());
          }
        }
        if (isMemberOfAGuild(character)) {
          if (
            !confirm(
              'This character has a guild, proceeding would remove it from the guild, are you sure?',
            )
          ) {
            return of(characterActionsActions.deleteCharacterCancel());
          }
        }
        if (isLeaderOfAGuild(character)) {
          if (
            !confirm(
              'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?',
            )
          ) {
            return of(characterActionsActions.deleteCharacterCancel());
          }
        }
        return this.characterApiService
          .deleteCharacterById(character._id)
          .pipe(map(() => characterActionsActions.deleteCharacterSuccess()));
      }),
      catchError(() => of(characterActionsActions.deleteCharacterFailure())),
    );
  });

  loadCharacterTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(characterActionsActions.loadCharacterTypes),
      switchMap(() => this.characterTypeService.getCharacterTypes()),
      map((characterTypes) =>
        characterActionsActions.loadCharacterTypesSuccess({ characterTypes }),
      ),
      catchError(() => of(characterActionsActions.loadCharacterTypesFailure())),
    );
  });

  refetchPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        characterActionsActions.createCharacterSuccess,
        characterActionsActions.updateCharacterSuccess,
        characterActionsActions.joinGuildSuccess,
        characterActionsActions.leaveGuildSuccess,
        characterActionsActions.deleteCharacterSuccess,
      ),
      map(() => characterTableActions.loadCharacters()),
    );
  });
}
