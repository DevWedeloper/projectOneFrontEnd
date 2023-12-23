import { CommonModule } from '@angular/common';
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
import { GuildActionsService } from '../../data-access/guild-actions.service';
import { GuildEditFormService } from '../../data-access/guild-edit-form.service';

@Component({
  selector: 'app-guild-edit',
  templateUrl: './guild-edit.component.html',
  styleUrls: ['./guild-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule,
    ReactiveFormsModule,
    SearchItemsComponent,
    ErrorTextDirective,
    CustomInputComponent,
    GreenButtonDirective,
    RedButtonDirective,
    SpinnerComponent,
    DynamicValidatorMessageDirective,
  ],
})
export class GuildEditComponent implements OnInit, OnDestroy {
  protected gas = inject(GuildActionsService);
  private gefs = inject(GuildEditFormService);
  @Input({ required: true }) guild!: Guild | null;
  @Input({ required: true }) searchNewLeaderResults!: Character[] | null;
  @Input({ required: true }) searchNewMemberResults!: Character[] | null;
  @Output() searchNewLeaderResultsQueryChange = new EventEmitter<string>();
  @Output() searchNewMemberResultsQueryChange = new EventEmitter<string>();
  @Output() updateGuildName = new EventEmitter<{
    guildId: string;
    newGuildNameForm: FormGroup;
  }>();
  @Output() updateGuildLeader = new EventEmitter<{
    guildId: string;
    newLeaderIdForm: FormGroup;
  }>();
  @Output() addMember = new EventEmitter<{
    guild: Guild;
    newMemberForm: FormGroup;
  }>();
  @Output() removeMember = new EventEmitter<{
    guildId: string;
    oldMember: Character;
  }>();
  @Output() closeEdit = new EventEmitter<void>();
  updateGuildNameForm!: FormGroup;
  updateGuildLeaderForm!: FormGroup;
  addMemberForm!: FormGroup;
  toggleNewLeaderSearchContainer = new BehaviorSubject<boolean>(false);
  toggleNewMemberSearchContainer = new BehaviorSubject<boolean>(false);

  constructor() {
    this.updateGuildNameForm = this.gefs.initializeUpdateNameForm();
  }

  ngOnInit(): void {
    this.addMemberForm = this.gefs.initializeAddMemberForm(
      this.guild?._id || null
    );
    this.updateGuildLeaderForm = this.gefs.initializeUpdateLeaderForm(
      this.guild?._id || null
    );
    this.updateGuildNameForm.patchValue({
      name: this.guild?.name,
    });
    this.updateGuildLeaderForm.patchValue({
      leader: this.guild?.leader?.name,
    });
    this.gefs.initialName$.next(this.updateGuildNameForm.get('name')?.value);
    this.gefs.initialLeader$.next(
      this.updateGuildLeaderForm.get('leader')?.value
    );
  }

  ngOnDestroy(): void {
    this.closeEdit.emit();
  }

  trackBy(index: number): number {
    return index;
  }
}
