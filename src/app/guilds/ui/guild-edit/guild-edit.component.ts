import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../../shared/form/dynamic-validator-message.directive';
import { Character } from '../../../shared/interfaces/character.interface';
import { Guild } from '../../../shared/interfaces/guild.interface';
import { CustomInputComponent } from '../../../shared/ui/components/custom-input/custom-input.component';
import { ModalComponent } from '../../../shared/ui/components/modal/modal.component';
import { SearchItemsComponent } from '../../../shared/ui/components/search-items/search-items.component';
import { SpinnerComponent } from '../../../shared/ui/components/spinner/spinner.component';
import { GreenButtonDirective } from '../../../shared/ui/directives/button/green-button.directive';
import { RedButtonDirective } from '../../../shared/ui/directives/button/red-button.directive';
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
  searchNewLeaderResultsQueryChange = output<string>();
  searchNewMemberResultsQueryChange = output<string>();
  updateGuildName = output<{
    guildId: string;
    name: string;
  }>();
  updateGuildLeader = output<{
    guildId: string;
    leaderId: string;
  }>();
  addMember = output<{
    guild: Guild;
    member: string;
  }>();
  removeMember = output<{
    guildId: string;
    member: Character;
  }>();
  closeEdit = output<void>();
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
