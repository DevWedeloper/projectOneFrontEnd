import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { ErrorTextDirective } from 'src/app/shared/ui/directives/error-text.directive';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { CharacterActionsService } from '../../data-access/character-actions-service';

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
    ErrorTextDirective,
    FocusVisibleDirective,
    DynamicValidatorMessageDirective,
  ],
})
export class CharacterFormComponent {
  @Input() characterForm!: FormGroup;
  protected cas = inject(CharacterActionsService);
}
