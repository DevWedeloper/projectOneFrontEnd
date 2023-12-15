import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DividerDropdownComponent } from 'src/app/shared/ui/components/divider-dropdown/divider-dropdown.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { CreateButtonDirective } from 'src/app/shared/ui/directives/button/create-button.directive';
import { CharacterActionsService } from '../../data-access/character-actions-service';
import { CharacterFormService } from '../../data-access/character-form.service';
import { CharacterLoadingService } from '../../data-access/character-loading.service';
import { CharacterFormComponent } from '../character-form/character-form.component';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [
    CommonModule,
    CharacterFormComponent,
    DividerDropdownComponent,
    CreateButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss'],
  providers: [CharacterFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCreateComponent {
  cfs = inject(CharacterFormService);
  ls = inject(CharacterLoadingService);
  cas = inject(CharacterActionsService);
  @Output() createCharacter = new EventEmitter<FormGroup>();
  characterForm!: FormGroup;

  constructor() {
    this.characterForm = this.cfs.initializeCharacterForm();
  }

  resetForm(): void {
    this.characterForm.reset();
    this.characterForm.get('characterType')?.setValue('');
  }
}
