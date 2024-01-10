import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { DividerDropdownComponent } from 'src/app/shared/ui/components/divider-dropdown/divider-dropdown.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { CreateButtonDirective } from 'src/app/shared/ui/directives/button/create-button.directive';
import { CharacterFormService } from '../../data-access/character-form.service';
import {
  selectCreateSuccess,
  selectIsCreating,
} from '../../state/character-actions.reducers';
import { selectInitialLoading } from '../../state/character-table.reducers';
import { CharacterFormComponent } from '../character-form/character-form.component';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [
    CommonModule,
    CharacterFormComponent,
    DividerDropdownComponent,
    CreateButtonDirective,
    SpinnerComponent,
  ],
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss'],
  providers: [CharacterFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCreateComponent {
  private cfs = inject(CharacterFormService);
  private store = inject(Store);
  @Output() createCharacter = new EventEmitter<Character>();
  protected characterForm!: FormGroup;
  protected loading$ = this.store.select(selectInitialLoading);
  protected createLoading$ = this.store.select(selectIsCreating);
  private createSuccess$ = this.store.select(selectCreateSuccess);

  constructor() {
    this.characterForm = this.cfs.initializeCharacterForm();
    this.createSuccess$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.characterForm.reset();
        this.characterForm.get('characterType')?.setValue('');
      });
  }

  protected resetForm(): void {
    this.characterForm.reset();
    this.characterForm.get('characterType')?.setValue('');
  }
}
