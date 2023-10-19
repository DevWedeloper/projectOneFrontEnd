import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { ModalComponent } from 'src/app/shared/ui/components/modal/modal.component';
import { SearchItemsComponent } from 'src/app/shared/ui/components/search-items/search-items.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { GreenButtonDirective } from 'src/app/shared/ui/directives/button/green-button.directive';
import { RedButtonDirective } from 'src/app/shared/ui/directives/button/red-button.directive';
import { ErrorTextDirective } from 'src/app/shared/ui/directives/error-text.directive';
import { CharacterActionsService } from '../../data-access/character-actions-service';
import { CharacterFormService } from '../../data-access/character-form.service';
import { CharacterFormComponent } from '../character-form/character-form.component';

@Component({
  selector: 'app-character-edit',
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    NgTemplateOutlet,
    CharacterFormComponent,
    FormsModule,
    SearchItemsComponent,
    ReactiveFormsModule,
    ErrorTextDirective,
    CustomInputComponent,
    GreenButtonDirective,
    RedButtonDirective,
    SpinnerComponent
  ],
})
export class CharacterEditComponent implements OnInit {
  cfs = inject(CharacterFormService);
  cas = inject(CharacterActionsService);
  fb = inject(FormBuilder);
  @Input({ required: true }) character: Character | null = null;
  @Input({ required: true }) searchResults$ = new BehaviorSubject<Guild[]>([]);
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() updateCharacter = new EventEmitter<{
    characterForm: FormGroup;
    previousCharacterData: Character;
  }>();
  @Output() joinGuild = new EventEmitter<{
    character: Character;
    joinGuildForm: FormGroup;
    selectedGuildId: string;
  }>();
  @Output() leaveGuild = new EventEmitter<{
    character: Character;
    joinGuildForm: FormGroup;
  }>();
  @Output() closeModal = new EventEmitter<void>();
  characterForm!: FormGroup;
  joinGuildForm!: FormGroup;
  selectedGuildId$ = new BehaviorSubject<string>('');

  constructor() {
    this.characterForm = this.cfs.initializeCharacterForm();
    this.joinGuildForm = this.fb.group({
      guild: ['', [Validators.required]],
    });
    this.cas.characterLeaveGuild$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.joinGuildForm.reset();
    });
  }

  ngOnInit(): void {
    this.characterForm.patchValue({
      name: this.character?.name || '',
      characterType: this.character?.characterType || '',
      health: this.character?.health || null,
      strength: this.character?.strength || null,
      agility: this.character?.agility || null,
      intelligence: this.character?.intelligence || null,
      armor: this.character?.armor || null,
      critChance: this.character?.critChance || null,
    });
    this.joinGuildForm.patchValue({
      guild: this.character?.guild?.name || null,
    });
  }
}
