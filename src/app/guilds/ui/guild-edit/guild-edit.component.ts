import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { ModalComponent } from 'src/app/shared/ui/components/modal/modal.component';
import { SearchItemsComponent } from 'src/app/shared/ui/components/search-items/search-items.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { GreenButtonDirective } from 'src/app/shared/ui/directives/button/green-button.directive';
import { RedButtonDirective } from 'src/app/shared/ui/directives/button/red-button.directive';
import { GuildEditFormService } from '../../data-access/guild-edit-form.service';
import {
  selectAddMemberSuccess,
  selectIsAddingMember,
  selectIsRemovingMember,
  selectIsUpdatingLeader,
  selectIsUpdatingName,
  selectMemberToRemove,
} from '../../state/guild-actions.reducers';

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
    CustomInputComponent,
    GreenButtonDirective,
    RedButtonDirective,
    SpinnerComponent,
    DynamicValidatorMessageDirective,
  ],
})
export class GuildEditComponent implements OnInit, OnDestroy {
  private gefs = inject(GuildEditFormService);
  private store = inject(Store);
  guild = input.required<Guild | null>();
  searchNewLeaderResults = input.required<Character[] | null>();
  searchNewMemberResults = input.required<Character[] | null>();
  @Output() searchNewLeaderResultsQueryChange = new EventEmitter<string>();
  @Output() searchNewMemberResultsQueryChange = new EventEmitter<string>();
  @Output() updateGuildName = new EventEmitter<{
    guildId: string;
    name: string;
  }>();
  @Output() updateGuildLeader = new EventEmitter<{
    guildId: string;
    leaderId: string;
  }>();
  @Output() addMember = new EventEmitter<{
    guild: Guild;
    member: string;
  }>();
  @Output() removeMember = new EventEmitter<{
    guildId: string;
    member: Character;
  }>();
  @Output() closeEdit = new EventEmitter<void>();
  protected updateGuildNameForm!: FormGroup;
  protected updateGuildLeaderForm!: FormGroup;
  protected addMemberForm!: FormGroup;
  protected toggleNewLeaderSearchContainer = new BehaviorSubject<boolean>(
    false,
  );
  protected toggleNewMemberSearchContainer = new BehaviorSubject<boolean>(
    false,
  );
  protected nameLoading$ = this.store.select(selectIsUpdatingName);
  protected leaderLoading$ = this.store.select(selectIsUpdatingLeader);
  protected addMemberLoading$ = this.store.select(selectIsAddingMember);
  protected addMemberSuccess$ = this.store.select(selectAddMemberSuccess);
  protected removeMemberLoading$ = this.store.select(selectIsRemovingMember);
  protected memberToRemove$ = this.store.select(selectMemberToRemove);

  constructor() {
    this.updateGuildNameForm = this.gefs.initializeUpdateNameForm();
    this.addMemberSuccess$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.addMemberForm.reset();
      });
  }

  ngOnInit(): void {
    this.addMemberForm = this.gefs.initializeAddMemberForm(
      this.guild()?._id || null,
    );
    this.updateGuildLeaderForm = this.gefs.initializeUpdateLeaderForm(
      this.guild()?._id || null,
    );
    this.updateGuildNameForm.patchValue({
      name: this.guild()?.name,
    });
    this.updateGuildLeaderForm.patchValue({
      leader: this.guild()?.leader?.name,
    });
    this.gefs.initialName$.next(this.updateGuildNameForm.get('name')?.value);
    this.gefs.initialLeader$.next(
      this.updateGuildLeaderForm.get('leader')?.value,
    );
  }

  ngOnDestroy(): void {
    this.closeEdit.emit();
  }
}
