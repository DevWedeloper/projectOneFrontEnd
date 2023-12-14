import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CharacterApiService } from 'src/app/shared/data-access/character-api.service';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { DividerDropdownComponent } from 'src/app/shared/ui/components/divider-dropdown/divider-dropdown.component';
import { SearchItemsComponent } from 'src/app/shared/ui/components/search-items/search-items.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { CreateButtonDirective } from 'src/app/shared/ui/directives/button/create-button.directive';
import { ErrorTextDirective } from 'src/app/shared/ui/directives/error-text.directive';
import { GuildActionsService } from '../../data-access/guild-actions.service';
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
    CreateButtonDirective,
    SpinnerComponent,
  ],
  templateUrl: './guild-create.component.html',
  styleUrls: ['./guild-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildCreateComponent {
  gfs = inject(GuildFormService);
  ls = inject(GuildLoadingService);
  gas = inject(GuildActionsService);
  characterApiService = inject(CharacterApiService);
  @Input({ required: true }) searchLeaderResults$ = new BehaviorSubject<
    Character[]
  >([]);
  @Output() createGuild = new EventEmitter<{
    guildForm: FormGroup;
  }>();
  @Output() searchLeaderResultsQueryChange = new EventEmitter<string>();
  guildForm!: FormGroup;
  toggleSearchContainer = new BehaviorSubject<boolean>(false);

  constructor() {
    this.guildForm = this.gfs.initializeGuildForm();
  }
}
