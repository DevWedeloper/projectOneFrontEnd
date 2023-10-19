import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { CharacterApiService } from 'src/app/shared/data-access/character-api.service';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { DividerDropdownComponent } from 'src/app/shared/ui/components/divider-dropdown/divider-dropdown.component';
import { SearchItemsComponent } from 'src/app/shared/ui/components/search-items/search-items.component';
import { CreateButtonDirective } from 'src/app/shared/ui/directives/button/create-button.directive';
import { ErrorTextDirective } from 'src/app/shared/ui/directives/error-text.directive';
import { GuildFormService } from '../../data-access/guild-form.service';
import { GuildLoadingService } from '../../data-access/guild-loading.service';

@Component({
  selector: 'app-guild-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchItemsComponent,
    ErrorTextDirective,
    DividerDropdownComponent,
    CustomInputComponent,
    CreateButtonDirective
  ],
  templateUrl: './guild-create.component.html',
  styleUrls: ['./guild-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildCreateComponent {
  gfs = inject(GuildFormService);
  ls = inject(GuildLoadingService);
  @Output() createGuild = new EventEmitter<{guildForm: FormGroup, leaderId: string}>();
  searchResults$ = new BehaviorSubject<Character[]>([]);
  searchQuery$ = new BehaviorSubject<string>('');
  selectedLeaderId$ = new BehaviorSubject<string>('');
  guildForm!: FormGroup;

  constructor(private characterApiService: CharacterApiService) {
    this.searchQuery$
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
        this.searchResults$.next(characters);
      });

    this.guildForm = this.gfs.initializeGuildForm();
  }
}
