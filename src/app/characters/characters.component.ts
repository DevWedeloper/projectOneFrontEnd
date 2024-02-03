import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  take,
} from 'rxjs';
import { AuthService } from 'src/app/auth/data-access/auth.service';
import { CharacterApiService } from '../shared/data-access/character-api.service';
import { GuildApiService } from '../shared/data-access/guild-api.service';
import { Character } from '../shared/interfaces/character.interface';
import { Guild } from '../shared/interfaces/guild.interface';
import { ModalService } from '../shared/ui/components/modal/modal.service';
import { CharacterSortParams } from './interfaces/character-sort-params.interface';
import { characterActionsActions } from './state/character-actions.action';
import { selectSelectedCharacter } from './state/character-actions.reducers';
import { characterTableActions } from './state/character-table.actions';
import {
  selectCharacterData,
  selectCurrentPage,
  selectPageSize,
} from './state/character-table.reducers';
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
export class CharactersComponent implements OnDestroy {
  protected authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  protected ms = inject(ModalService);
  private guildApiService = inject(GuildApiService);
  private characterApiService = inject(CharacterApiService);
  private store = inject(Store);
  protected tableSearchQuery$ = new Subject<string>();
  protected searchResults$ = new BehaviorSubject<Guild[]>([]);
  protected guildSearchQuery$ = new BehaviorSubject<string>('');
  @ViewChild('modalTemplate')
  private editComponent!: TemplateRef<HTMLElement>;
  protected characterData$ = this.store.select(selectCharacterData);
  protected currentPage$ = this.store.select(selectCurrentPage);
  protected pageSize$ = this.store.select(selectPageSize);
  protected selectedCharacter$ = this.store.select(selectSelectedCharacter);

  constructor() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.store.dispatch(
        characterTableActions.setAllParameters({
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
        this.characterApiService
          .getCharacterByName(params['name'])
          .pipe(takeUntilDestroyed())
          .subscribe((selectedCharacter) => {
            this.store.dispatch(
              characterActionsActions.updateSelectedCharacter({
                selectedCharacter,
              }),
            );
            this.ms.open(this.editComponent);
          });
      }
    });

    this.tableSearchQuery$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchQuery) => {
        this.store.dispatch(
          characterTableActions.setPageNumberAndSearchQuery({
            page: 1,
            searchQuery,
          }),
        );
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
        takeUntilDestroyed(),
      )
      .subscribe((guilds) => {
        this.searchResults$.next(guilds);
      });

    this.store.dispatch(characterActionsActions.loadCharacterTypes());
  }

  ngOnDestroy(): void {
    this.store.dispatch(characterActionsActions.resetStateOnDestroy());
    this.store.dispatch(characterTableActions.resetStateOnDestroy());
  }

  setCurrentPage(page: number): void {
    this.store.dispatch(characterTableActions.setCurrentPage({ page }));
  }

  setPageSize(pageSize: number): void {
    this.store.dispatch(characterTableActions.setPageSize({ pageSize }));
  }

  setSortParams(sortParams: CharacterSortParams): void {
    this.store.dispatch(
      characterTableActions.setSortParams({
        sortParams,
      }),
    );
  }

  setSearchQuery(searchQuery: string): void {
    this.store.dispatch(characterTableActions.setSearchQuery({ searchQuery }));
  }

  setName(name: string | undefined): void {
    this.store.dispatch(characterTableActions.setNameFilter({ name }));
  }

  createCharacter(character: Character): void {
    this.store.dispatch(characterActionsActions.createCharacter({ character }));
  }

  updateCharacter(
    character: Character,
    previousCharacterData: Character,
  ): void {
    this.store.dispatch(
      characterActionsActions.updateCharacter({
        character,
        previousCharacterData,
      }),
    );
  }

  joinGuild(character: Character, guildName: string): void {
    this.store.dispatch(
      characterActionsActions.joinGuild({ character, guildName }),
    );
  }

  leaveGuild(character: Character): void {
    this.store.dispatch(characterActionsActions.leaveGuild({ character }));
  }

  deleteCharacter(character: Character): void {
    this.store.dispatch(characterActionsActions.deleteCharacter({ character }));
  }

  updateSelectedCharacter(selectedCharacter: Character | null): void {
    this.store.dispatch(
      characterActionsActions.updateSelectedCharacter({ selectedCharacter }),
    );
  }
}
