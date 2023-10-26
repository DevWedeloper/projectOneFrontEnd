import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { ErrorTextDirective } from 'src/app/shared/ui/directives/error-text.directive';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { CharacterFormService } from '../../data-access/character-form.service';
import { CharacterTypeService } from '../../data-access/character-type.service';

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
    FocusVisibleDirective
  ],
})
export class CharacterFormComponent {
  @Input() characterForm!: FormGroup;
  cts = inject(CharacterTypeService);
  cfs = inject(CharacterFormService);
}
