import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import { CommonModule } from '@angular/common';
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
import { GuildApiService } from '../shared/data-access/guild-api.service';
import { Guild } from '../shared/interfaces/guild.interface';
import { ModalService } from '../shared/ui/components/modal/modal.service';
import { CharacterActionsService } from './data-access/character-actions-service';
import { CharacterService } from './data-access/character.service';
import { CharacterCreateComponent } from './ui/character-create/character-create.component';
import { CharacterEditComponent } from './ui/character-edit/character-edit.component';
import { CharacterTableComponent } from './ui/character-table/character-table.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    CharacterCreateComponent,
    CharacterTableComponent,
    CharacterEditComponent,
  ],
})
export class CharactersComponent {
  authService = inject(AuthService);
  cas = inject(CharacterActionsService);
  route = inject(ActivatedRoute);
  cs = inject(CharacterService);
  ms = inject(ModalService);
  guildApiService = inject(GuildApiService);
  tableSearchQuery$ = new Subject<string>();
  searchResults$ = new BehaviorSubject<Guild[]>([]);
  guildSearchQuery$ = new BehaviorSubject<string>('');

  constructor() {
    this.route.queryParams
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((params) => {
        this.cs.currentPage$.next(+params['page'] || 1);
        this.cs.pageSize$.next(+params['pageSize'] || 10);
        this.cs.sortParams$.next({
          sortBy: params['sortBy'] || 'name',
          sortOrder: params['sortOrder'] || 'asc',
        });
      });

    this.tableSearchQuery$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchQuery) => {
        this.cs.currentPage$.next(1);
        this.cs.searchQuery$.next(searchQuery);
      });

    this.guildSearchQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() !== '') {
            return this.guildApiService.searchGuildsByName(query);
          } else {
            return of([]);
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe((guilds) => {
        this.searchResults$.next(guilds);
      });
  }
}