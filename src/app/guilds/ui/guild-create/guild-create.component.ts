import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../../shared/form/dynamic-validator-message.directive';
import { Character } from '../../../shared/interfaces/character.interface';
import { CustomInputComponent } from '../../../shared/ui/components/custom-input/custom-input.component';
import { DividerDropdownComponent } from '../../../shared/ui/components/divider-dropdown/divider-dropdown.component';
import { SearchItemsComponent } from '../../../shared/ui/components/search-items/search-items.component';
import { SpinnerComponent } from '../../../shared/ui/components/spinner/spinner.component';
import { CreateButtonDirective } from '../../../shared/ui/directives/button/create-button.directive';
import { GuildFormService } from '../../data-access/guild-form.service';
import {
  selectCreateSuccess,
  selectIsCreating,
} from '../../state/guild-actions.reducers';
import { selectInitialLoading } from '../../state/guild-table.reducers';

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
  private store = inject(Store);
  searchLeaderResults = input.required<Character[] | null>();
  @Output() createGuild = new EventEmitter<{
    name: string;
    leader: string;
  }>();
  @Output() searchLeaderResultsQueryChange = new EventEmitter<string>();
  protected guildForm!: FormGroup;
  protected toggleSearchContainer = new BehaviorSubject<boolean>(false);
  protected loading$ = this.store.select(selectInitialLoading);
  protected createLoading$ = this.store.select(selectIsCreating);
  private createSuccess$ = this.store.select(selectCreateSuccess);

  constructor() {
    this.guildForm = this.gfs.initializeGuildForm();
    this.createSuccess$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.guildForm.reset();
      });
  }

  protected resetForm(): void {
    this.guildForm.reset();
  }
}
