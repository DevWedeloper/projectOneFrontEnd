import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  take,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Character } from '../shared/interfaces/character.interface';
import { ModalService } from '../shared/ui/components/modal/modal.service';
import { GuildActionsService } from './data-access/guild-actions.service';
import { GuildService } from './data-access/guild.service';
import { GuildCreateComponent } from './ui/guild-create/guild-create.component';
import { GuildEditComponent } from './ui/guild-edit/guild-edit.component';
import { GuildTableComponent } from './ui/guild-table/guild-table.component';
import { GuildApiService } from '../shared/data-access/guild-api.service';
import { CharacterApiService } from '../shared/data-access/character-api.service';

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
export class GuildsComponent {
  characterApiService = inject(CharacterApiService);
  guildApiService = inject(GuildApiService);
  authService = inject(AuthService);
  gs = inject(GuildService);
  gas = inject(GuildActionsService);
  route = inject(ActivatedRoute);
  ms = inject(ModalService);
  tableSearchQuery$ = new Subject<string>();
  searchNewLeaderResults$ = new BehaviorSubject<Character[]>([]);
  searchNewLeaderResultsQuery$ = new BehaviorSubject<string>('');
  searchNewMemberResults$ = new BehaviorSubject<Character[]>([]);
  searchNewMemberResultsQuery$ = new BehaviorSubject<string>('');

  constructor() {
    this.route.queryParams
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((params) => {
        this.gs.currentPage$.next(+params['page'] || 1);
        this.gs.pageSize$.next(+params['pageSize'] || 10);
        this.gs.sortParams$.next({
          sortBy: params['sortBy'] || 'name',
          sortOrder: params['sortOrder'] || 'asc',
        });
      });

    this.tableSearchQuery$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchQuery) => {
        this.gs.currentPage$.next(1);
        this.gs.searchQuery$.next(searchQuery);
      });

    this.searchNewLeaderResultsQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() !== '') {
            return this.guildApiService.searchGuildMemberById(
              query,
              this.gas.guildToUpdate$.value?._id || ''
            );
          } else {
            return of([]);
          }
        }),
        takeUntilDestroyed()
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
        takeUntilDestroyed()
      )
      .subscribe((characters) => {
        this.searchNewMemberResults$.next(characters);
      });
  }
}
