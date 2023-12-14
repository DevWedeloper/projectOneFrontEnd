import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { BehaviorSubject, take } from 'rxjs';
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
  ],
})
export class GuildEditComponent implements OnInit, OnDestroy {
  gas = inject(GuildActionsService);
  gefs = inject(GuildEditFormService);
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  @Input({ required: true }) guild!: Guild | null;
  @Input({ required: true }) searchNewLeaderResults$ = new BehaviorSubject<
    Character[]
  >([]);
  @Input({ required: true }) searchNewMemberResults$ = new BehaviorSubject<
    Character[]
  >([]);
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
    this.updateGuildNameForm.valueChanges
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(() => {
        this.gefs.updateNameInitialValueSet$.next(false);
      });
  }

  ngOnInit(): void {
    this.addMemberForm = this.gefs.initializeAddMemberForm(this.guild?._id || null);
    this.updateGuildLeaderForm = this.gefs.initializeUpdateLeaderForm(this.guild?._id || null);
    this.updateGuildLeaderForm.valueChanges
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.gefs.updateLeaderInitialValueSet$.next(false);
      });
    this.updateGuildNameForm.patchValue({
      name: this.guild?.name,
    });
    this.updateGuildLeaderForm.patchValue({
      leader: this.guild?.leader?.name,
    });
    this.gefs.initialName$.next(this.updateGuildNameForm.get('name')?.value);
    this.gefs.initialLeader$.next(this.updateGuildLeaderForm.get('leader')?.value);
  }

  ngOnDestroy(): void {
    this.closeEdit.emit();
  }

  trackBy(index: number): number {
    return index;
  }
}
