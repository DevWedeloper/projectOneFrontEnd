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
import {
  isLeaderOfDifferentGuild,
  isMemberOfDifferentGuild,
} from 'src/app/shared/utils/guild-membership-status.utils';
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
  guildDelete$ = new Subject<Guild>();
  guildToUpdate$ = new BehaviorSubject<Guild | null>(null);
  memberToRemove$ = new BehaviorSubject<Character | null>(null);
  createLoading$ = new BehaviorSubject<boolean>(false);
  updateNameLoading$ = new BehaviorSubject<boolean>(false);
  updateLeaderLoading$ = new BehaviorSubject<boolean>(false);
  addMemberLoading$ = new BehaviorSubject<boolean>(false);
  removeMemberLoading$ = new BehaviorSubject<boolean>(false);
  deleteLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.guildCreate$
      .pipe(
        tap(() => this.createLoading$.next(true)),
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
              this.createLoading$.next(false);
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.gs.refetchPage$.next();
        this.createLoading$.next(false);
      });

    this.guildUpdateName$
      .pipe(
        tap(() => this.updateNameLoading$.next(true)),
        switchMap(({ guildId, newGuildNameForm }) => {
          return this.guildApiService
            .updateGuildNameById(guildId, newGuildNameForm.value)
            .pipe(
              catchError((error) => {
                if (this.es.handleDuplicateKeyError(error)) {
                  newGuildNameForm.get('name')?.setErrors({ uniqueName: true });
                }
                this.updateNameLoading$.next(false);
                return EMPTY;
              })
            );
        }),
        tap((data) => {
          this.guildToUpdate$.next(data.guild);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.gs.refetchPage$.next();
        this.updateNameLoading$.next(false);
      });

    this.guildUpdateLeader$
      .pipe(
        tap(() => this.updateLeaderLoading$.next(true)),
        switchMap(({ guildId, newLeaderIdForm, newLeaderId }) => {
          return this.guildApiService
            .updateGuildLeaderById(guildId, { leader: newLeaderId })
            .pipe(
              catchError((error) => {
                if (this.es.handleNotFoundError(error)) {
                  newLeaderIdForm.get('leader')?.setErrors({ notFound: true });
                }
                this.updateLeaderLoading$.next(false);
                return EMPTY;
              })
            );
        }),
        tap((data) => {
          this.guildToUpdate$.next(data.guild);
          this.updateLeaderLoading$.next(false);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.gs.refetchPage$.next();
        this.updateLeaderLoading$.next(false);
      });

    this.guildAddMember$
      .pipe(
        tap(() => this.addMemberLoading$.next(true)),
        switchMap(({ guildId, newMemberForm }) => {
          console.log(newMemberForm.value.member);
          
          if (isMemberOfDifferentGuild(guildId, newMemberForm.value.member)) {
            if (
              !confirm(
                'This character has a previous guild, proceeding would remove it from the previous guild, are you sure?'
              )
            ) {
              this.addMemberLoading$.next(false);
              return EMPTY;
            }
          }
          if (isLeaderOfDifferentGuild(guildId, newMemberForm.value.member)) {
            if (
              !confirm(
                'This character is a leader of a guild, proceeding would delete its previous guild, are you sure?'
              )
            ) {
              this.addMemberLoading$.next(false);
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
      .subscribe(() => {
        this.gs.refetchPage$.next();
        this.addMemberLoading$.next(false);
      });

    this.guildRemoveMember$
      .pipe(
        tap(({ oldMember }) => {
          this.memberToRemove$.next(oldMember);
          this.removeMemberLoading$.next(true);
        }),
        switchMap(({ guildId, oldMember }) => {
          if (!confirm('Are you sure you want to kick this member?')) {
            this.removeMemberLoading$.next(false);
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
      .subscribe(() => {
        this.gs.refetchPage$.next();
        this.removeMemberLoading$.next(false);
      });

    this.guildDelete$
      .pipe(
        tap((guild) => {
          this.guildToUpdate$.next(guild);
          this.deleteLoading$.next(true);
        }),
        switchMap((guild) => {
          if (!confirm('Are you sure you want to delete this guild?')) {
            this.deleteLoading$.next(false);
            return EMPTY;
          }
          return this.guildApiService.deleteGuildById(guild._id);
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.gs.refetchPage$.next();
        this.deleteLoading$.next(false);
      });
  }
}
