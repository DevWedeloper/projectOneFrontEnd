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
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { DividerDropdownComponent } from 'src/app/shared/ui/components/divider-dropdown/divider-dropdown.component';
import { SearchItemsComponent } from 'src/app/shared/ui/components/search-items/search-items.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { CreateButtonDirective } from 'src/app/shared/ui/directives/button/create-button.directive';
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
    DividerDropdownComponent,
    CustomInputComponent,
    CreateButtonDirective,
    SpinnerComponent,
    DynamicValidatorMessageDirective,
  ],
  templateUrl: './guild-create.component.html',
  styleUrls: ['./guild-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildCreateComponent {
  private gfs = inject(GuildFormService);
  protected ls = inject(GuildLoadingService);
  protected gas = inject(GuildActionsService);
  @Input({ required: true }) searchLeaderResults!: Character[] | null;
  @Output() createGuild = new EventEmitter<{
    guildForm: FormGroup;
  }>();
  @Output() searchLeaderResultsQueryChange = new EventEmitter<string>();
  protected guildForm!: FormGroup;
  protected toggleSearchContainer = new BehaviorSubject<boolean>(false);

  constructor() {
    this.guildForm = this.gfs.initializeGuildForm();
  }
}
