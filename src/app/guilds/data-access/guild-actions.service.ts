import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  switchMap,
  tap,
} from 'rxjs';
import { ErrorService } from 'src/app/shared/data-access/error.service';
import { GuildApiService } from 'src/app/shared/data-access/guild-api.service';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { isLeaderOfDifferentGuild, isMemberOfDifferentGuild } from 'src/app/shared/utils/guild-membership-status.utils';
import { GuildService } from './guild.service';

@Injectable({
  providedIn: 'root',
})
export class GuildActionsService {
  gs = inject(GuildService);
  guildApiService = inject(GuildApiService);
  es = inject(ErrorService);
  guildCreate$ = new Subject<{ guildForm: FormGroup; leaderId: string }>();
  guildUpdateName$ = new Subject<{
    guildId: string;
    newGuildNameForm: FormGroup;
  }>();
  guildUpdateLeader$ = new Subject<{
    guildId: string;
    newLeaderIdForm: FormGroup;
    newLeaderId: string;
  }>();
  guildAddMember$ = new Subject<{
    guildId: string;
    newMemberForm: FormGroup;
  }>();
  guildRemoveMember$ = new Subject<{ guildId: string; oldMember: Character }>();
  guildDelete$ = new Subject<string>();
  guildToUpdate$ = new BehaviorSubject<Guild | null>(null);

  constructor() {
    this.guildCreate$
      .pipe(
        switchMap(({ guildForm, leaderId }) => {
          const guild = {
            name: guildForm.get('name')?.value,
            leader: leaderId,
          };
          return this.guildApiService.createGuild(guild).pipe(
            tap(() => guildForm.reset()),
            catchError((error) => {
              if (this.es.handleDuplicateKeyError(error)) {
                guildForm.get('name')?.setErrors({ uniqueName: true });
              } else {
                guildForm.get('leader')?.setErrors({ notFound: true });
              }
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.gs.refetchPage$.next());

    this.guildUpdateName$
      .pipe(
        switchMap(({ guildId, newGuildNameForm }) => {
          return this.guildApiService
            .updateGuildNameById(guildId, newGuildNameForm.value)
            .pipe(
              catchError((error) => {
                if (this.es.handleDuplicateKeyError(error)) {
                  newGuildNameForm.get('name')?.setErrors({ uniqueName: true });
                }
                return EMPTY;
              })
            );
        }),
        tap((data) => {
          this.guildToUpdate$.next(data.guild);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.gs.refetchPage$.next());

    this.guildUpdateLeader$
      .pipe(
        switchMap(({ guildId, newLeaderIdForm, newLeaderId }) => {
          return this.guildApiService
            .updateGuildLeaderById(guildId, { leader: newLeaderId })
            .pipe(
              catchError((error) => {
                if (this.es.handleNotFoundError(error)) {
                  newLeaderIdForm.get('leader')?.setErrors({ notFound: true });
                }
                return EMPTY;
              })
            );
        }),
        tap((data) => {
          this.guildToUpdate$.next(data.guild);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.gs.refetchPage$.next());

    this.guildAddMember$
      .pipe(
        switchMap(({ guildId, newMemberForm }) => {
          if (
            isMemberOfDifferentGuild(guildId, newMemberForm.value.member)
          ) {
            if (
              !confirm(
                'This character has a previous guild, proceeding would remove it from the previous guild, are you sure?'
              )
            ) {
              return EMPTY;
            }
          }
          if (
            isLeaderOfDifferentGuild(guildId, newMemberForm.value.member)
          ) {
            if (
              !confirm(
                'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
              return EMPTY;
            }
          }
          return this.guildApiService.addMemberToGuildById(
            guildId,
            newMemberForm.value
          );
        }),
        tap((data) => {
          this.guildToUpdate$.next(data.guild);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.gs.refetchPage$.next());

    this.guildRemoveMember$
      .pipe(
        switchMap(({ guildId, oldMember }) => {
          if (!confirm('Are you sure you want to kick this member?')) {
            return EMPTY;
          }
          return this.guildApiService.removeMemberFromGuildById(
            guildId,
            oldMember
          );
        }),
        tap((data) => {
          this.guildToUpdate$.next(data.guild);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.gs.refetchPage$.next());

    this.guildDelete$
      .pipe(
        switchMap((guildId) => {
          if (!confirm('Are you sure you want to delete this guild?')) {
            return EMPTY;
          }
          return this.guildApiService.deleteGuildById(guildId);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.gs.refetchPage$.next());
  }
}
