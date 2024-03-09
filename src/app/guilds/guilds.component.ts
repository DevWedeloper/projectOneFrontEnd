import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { AuthService } from '../auth/data-access/auth.service';
import { CharacterApiService } from '../shared/data-access/character-api.service';
import { GuildApiService } from '../shared/data-access/guild-api.service';
import { Character } from '../shared/interfaces/character.interface';
import { Guild } from '../shared/interfaces/guild.interface';
import { ModalService } from '../shared/ui/components/modal/modal.service';
import { GuildSortParams } from './interfaces/guild-sort-params.interface';
import { guildActionsActions } from './state/guild-actions.action';
import { selectSelectedGuild } from './state/guild-actions.reducers';
import { guildTableActions } from './state/guild-table.actions';
import {
  selectCurrentPage,
  selectGuildData,
  selectPageSize,
} from './state/guild-table.reducers';
import { GuildCreateComponent } from './ui/guild-create/guild-create.component';
import { GuildEditComponent } from './ui/guild-edit/guild-edit.component';
import { GuildTableComponent } from './ui/guild-table/guild-table.component';

@Component({
  selector: 'app-guilds',
  templateUrl: './guilds.component.html',
  styleUrls: ['./guilds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    GuildCreateComponent,
    GuildTableComponent,
    GuildEditComponent,
  ],
})
export class GuildsComponent implements OnDestroy {
  private characterApiService = inject(CharacterApiService);
  private guildApiService = inject(GuildApiService);
  protected authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  protected ms = inject(ModalService);
  private store = inject(Store);
  protected tableSearchQuery$ = new Subject<string>();
  protected searchLeaderResults$ = new BehaviorSubject<Character[]>([]);
  protected searchLeaderResultsQuery$ = new BehaviorSubject<string>('');
  protected searchNewLeaderResults$ = new BehaviorSubject<Character[]>([]);
  protected searchNewLeaderResultsQuery$ = new BehaviorSubject<string>('');
  protected searchNewMemberResults$ = new BehaviorSubject<Character[]>([]);
  protected searchNewMemberResultsQuery$ = new BehaviorSubject<string>('');
  private editComponent =
    viewChild.required<TemplateRef<HTMLElement>>('modalTemplate');
  protected guildData$ = this.store.select(selectGuildData);
  protected currentPage$ = this.store.select(selectCurrentPage);
  protected pageSize$ = this.store.select(selectPageSize);
  protected selectedGuild$ = this.store.select(selectSelectedGuild);

  constructor() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.store.dispatch(
        guildTableActions.setAllParameters({
          page: +params['page'] || 1,
          pageSize: +params['pageSize'] || 10,
          sortParams: {
            sortBy: params['sortBy'] || 'name',
            sortOrder: params['sortOrder'] || 'asc',
          },
          searchQuery: '',
          name: params['name'] || undefined,
        }),
      );

      if (params['name']) {
        this.guildApiService
          .getGuildByName(params['name'])
          .pipe(takeUntilDestroyed())
          .subscribe((selectedGuild) => {
            this.store.dispatch(
              guildActionsActions.updateSelectedGuild({ selectedGuild }),
            );
            this.ms.open(this.editComponent());
          });
      }
    });

    this.tableSearchQuery$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchQuery) => {
        this.store.dispatch(
          guildTableActions.setPageNumberAndSearchQuery({
            page: 1,
            searchQuery,
          }),
        );
      });

    this.searchLeaderResultsQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() !== '') {
            return this.characterApiService.searchCharactersByName(query);
          } else {
            return of([]);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe((characters) => {
        this.searchLeaderResults$.next(characters);
      });

    this.searchNewLeaderResultsQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() !== '') {
            return this.selectedGuild$.pipe(
              filter((selectedGuild) => !!selectedGuild),
              map((selectedGuild) => selectedGuild!._id),
              switchMap((guildId) =>
                this.guildApiService.searchGuildMemberById(
                  query,
                  guildId || '',
                ),
              ),
            );
          } else {
            return of([]);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe((characters) => {
        this.searchNewLeaderResults$.next(characters);
      });

    this.searchNewMemberResultsQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() !== '') {
            return this.characterApiService.searchCharactersByName(query);
          } else {
            return of([]);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe((characters) => {
        this.searchNewMemberResults$.next(characters);
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(guildActionsActions.resetStateOnDestroy());
    this.store.dispatch(guildTableActions.resetStateOnDestroy());
  }

  protected setCurrentPage(page: number): void {
    this.store.dispatch(guildTableActions.setCurrentPage({ page }));
  }

  protected setPageSize(pageSize: number): void {
    this.store.dispatch(guildTableActions.setPageSize({ pageSize }));
  }

  protected setSortParams(sortParams: GuildSortParams): void {
    this.store.dispatch(
      guildTableActions.setSortParams({
        sortParams,
      }),
    );
  }

  protected setSearchQuery(searchQuery: string): void {
    this.store.dispatch(guildTableActions.setSearchQuery({ searchQuery }));
  }

  protected setName(name: string | undefined): void {
    this.store.dispatch(guildTableActions.setNameFilter({ name }));
  }

  protected createGuild(name: string, leader: string): void {
    this.store.dispatch(guildActionsActions.createGuild({ name, leader }));
  }

  protected updateName(guildId: string, name: string): void {
    this.store.dispatch(guildActionsActions.updateGuildName({ guildId, name }));
  }

  protected updateLeader(guildId: string, leaderId: string): void {
    this.store.dispatch(
      guildActionsActions.updateGuildLeader({ guildId, leaderId }),
    );
  }

  protected addMember(guild: Guild, member: string): void {
    this.store.dispatch(guildActionsActions.addMember({ guild, member }));
  }

  protected removeMember(guildId: string, member: Character): void {
    this.store.dispatch(guildActionsActions.removeMember({ guildId, member }));
  }

  protected deleteGuild(guild: Guild): void {
    this.store.dispatch(guildActionsActions.deleteGuild({ guild }));
  }

  protected updateSelectedGuild(selectedGuild: Guild | null): void {
    this.store.dispatch(
      guildActionsActions.updateSelectedGuild({ selectedGuild }),
    );
  }
}
