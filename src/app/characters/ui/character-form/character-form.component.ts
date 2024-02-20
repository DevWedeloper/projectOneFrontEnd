import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { selectCharacterTypes } from '../../state/character-actions.reducers';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    FocusVisibleDirective,
    DynamicValidatorMessageDirective,
  ],
})
export class CharacterFormComponent {
  private store = inject(Store);
  protected characterTypes$ = this.store.select(selectCharacterTypes);
  characterForm = input.required<FormGroup>();
}
