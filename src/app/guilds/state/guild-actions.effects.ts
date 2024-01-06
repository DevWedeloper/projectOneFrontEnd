import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CheckGuildRelationStatusServiceApi } from 'src/app/shared/data-access/check-guild-relation-status.service-api';
import { GuildApiService } from 'src/app/shared/data-access/guild-api.service';
import { guildActionsActions } from './guild-actions.action';
import { guildTableActions } from './guild-table.actions';

@Injectable()
export class GuildActionsEffects {
  private actions$ = inject(Actions);
  private guildApiService = inject(GuildApiService);
  private checkGuildRelationStatusApiService = inject(
    CheckGuildRelationStatusServiceApi,
  );

  createGuild$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildActionsActions.createGuild),
      switchMap((action) => {
        const name = action.name;
        const leader = action.leader;
        return this.checkGuildRelationStatusApiService
          .checkGuildRelationStatus(leader)
          .pipe(
            switchMap((data) => {
              if (data.memberOfGuild) {
                if (
                  !confirm(
                    'This character has a guild, proceeding would remove it from the guild, are you sure?',
                  )
                ) {
                  return of(guildActionsActions.createGuildCancel());
                }
              }
              if (data.leaderOfGuild) {
                if (
                  !confirm(
                    'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?',
                  )
                ) {
                  return of(guildActionsActions.createGuildCancel());
                }
              }
              const guild = {
                name,
                character: leader,
              };
              return this.guildApiService
                .createGuild(guild)
                .pipe(map(() => guildActionsActions.createGuildSuccess()));
            }),
          );
      }),
      catchError(() => of(guildActionsActions.createGuildFailure())),
    );
  });

  updateGuildName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildActionsActions.updateGuildName),
      switchMap((action) =>
        this.guildApiService.updateGuildNameById(action.guildId, action.name),
      ),
      map((data) =>
        guildActionsActions.updateGuildNameSuccess({
          selectedGuild: data.guild,
        }),
      ),
      catchError(() => of(guildActionsActions.updateGuildNameFailure())),
    );
  });

  updateGuildLeader$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildActionsActions.updateGuildLeader),
      switchMap((action) =>
        this.guildApiService.updateGuildLeaderById(
          action.guildId,
          action.leaderId,
        ),
      ),
      map((data) =>
        guildActionsActions.updateGuildLeaderSuccess({
          selectedGuild: data.guild,
        }),
      ),
      catchError(() => of(guildActionsActions.updateGuildLeaderFailure())),
    );
  });

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildActionsActions.addMember),
      switchMap((action) => {
        const guild = action.guild;
        const member = action.member;
        if (guild.totalMembers === guild.maxMembers) {
          confirm('Guild is full.');
          return of(guildActionsActions.addMemberCancel());
        }
        return this.checkGuildRelationStatusApiService
          .checkGuildRelationStatus(member)
          .pipe(
            switchMap((data) => {
              if (data.memberOfGuild) {
                if (
                  !confirm(
                    'This character has a guild, proceeding would remove it from the guild, are you sure?',
                  )
                ) {
                  return of(guildActionsActions.addMemberCancel());
                }
              }
              if (data.leaderOfGuild) {
                if (
                  !confirm(
                    'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?',
                  )
                ) {
                  return of(guildActionsActions.addMemberCancel());
                }
              }
              return this.guildApiService
                .addMemberToGuildById(guild._id, member)
                .pipe(
                  map((data) =>
                    guildActionsActions.addMemberSuccess({
                      selectedGuild: data.guild,
                    }),
                  ),
                );
            }),
          );
      }),
      catchError(() => of(guildActionsActions.addMemberFailure())),
    );
  });

  removeMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildActionsActions.removeMember),
      switchMap((action) => {
        if (!confirm('Are you sure you want to kick this member?')) {
          return of(guildActionsActions.removeMemberCancel());
        }
        return this.guildApiService
          .removeMemberFromGuildById(action.guildId, action.member._id)
          .pipe(
            map((data) =>
              guildActionsActions.removeMemberSuccess({
                selectedGuild: data.guild,
              }),
            ),
          );
      }),
      catchError(() => of(guildActionsActions.removeMemberFailure())),
    );
  });

  deleteGuild$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildActionsActions.deleteGuild),
      switchMap((action) => {
        if (!confirm('Are you sure you want to delete this guild?')) {
          return of(guildActionsActions.deleteGuildCancel());
        }
        return this.guildApiService
          .deleteGuildById(action.guild._id)
          .pipe(map(() => guildActionsActions.deleteGuildSuccess()));
      }),
      catchError(() => of(guildActionsActions.deleteGuildFailure())),
    );
  });

  refetchPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        guildActionsActions.createGuildSuccess,
        guildActionsActions.updateGuildNameSuccess,
        guildActionsActions.updateGuildLeaderSuccess,
        guildActionsActions.addMemberSuccess,
        guildActionsActions.removeMemberSuccess,
        guildActionsActions.deleteGuildSuccess,
      ),
      map(() => guildTableActions.loadGuilds()),
    );
  });
}
