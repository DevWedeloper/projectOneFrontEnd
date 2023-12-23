import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
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
import { CharacterJoinGuildFormService } from '../../data-access/character-join-guild-form.service';
import { CharacterFormComponent } from '../character-form/character-form.component';

@Component({
  selector: 'app-character-edit',
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.scss'],
  providers: [CharacterFormService],
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
    SpinnerComponent,
    DynamicValidatorMessageDirective,
  ],
})
export class CharacterEditComponent implements OnInit, OnDestroy {
  private cfs = inject(CharacterFormService);
  protected cas = inject(CharacterActionsService);
  private cjgfs = inject(CharacterJoinGuildFormService);
  @Input({ required: true }) character: Character | null = null;
  @Input({ required: true }) searchResults!: Guild[] | null;
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() updateCharacter = new EventEmitter<{
    characterForm: FormGroup;
    previousCharacterData: Character;
  }>();
  @Output() joinGuild = new EventEmitter<{
    character: Character;
    joinGuildForm: FormGroup;
  }>();
  @Output() leaveGuild = new EventEmitter<{
    character: Character;
    joinGuildForm: FormGroup;
  }>();
  @Output() closeModal = new EventEmitter<void>();
  protected characterForm!: FormGroup;
  protected joinGuildForm!: FormGroup;
  protected toggleSearchContainer = new BehaviorSubject<boolean>(false);

  constructor() {
    this.characterForm = this.cfs.initializeCharacterForm();
    this.joinGuildForm = this.cjgfs.initializeJoinGuildForm();
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
    this.cfs.initialName$.next(this.characterForm.get('name')?.value);
    this.cjgfs.initialName$.next(this.joinGuildForm.get('guild')?.value);
  }

  ngOnDestroy(): void {
    this.closeModal.emit();
  }
}
