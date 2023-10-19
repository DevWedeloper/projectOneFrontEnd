import { CommonModule } from '@angular/common';
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
import { GuildActionsService } from '../../data-access/guild-actions.service';

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
    SpinnerComponent
  ],
})
export class GuildEditComponent implements OnInit {
  gas = inject(GuildActionsService);
  fb = inject(FormBuilder);
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
    newLeaderId: string;
  }>();
  @Output() addMember = new EventEmitter<{
    guildId: string;
    newMemberForm: FormGroup;
  }>();
  @Output() removeMember = new EventEmitter<{
    guildId: string;
    oldMember: Character;
  }>();
  updateGuildNameForm!: FormGroup;
  updateGuildLeaderForm!: FormGroup;
  addMemberForm!: FormGroup;
  selectedLeaderId$ = new BehaviorSubject<string>('');
  selectedNewMemberName$ = new BehaviorSubject<string>('');

  constructor() {
    this.gas.guildAddMember$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.selectedNewMemberName$.next(''));

    this.updateGuildNameForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.updateGuildLeaderForm = this.fb.group({
      leader: ['', [Validators.required]],
    });

    this.addMemberForm = this.fb.group({
      member: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.updateGuildNameForm.patchValue({
      name: this.guild?.name,
    });
    this.updateGuildLeaderForm.patchValue({
      leader: this.guild?.leader?.name,
    });
  }

  trackBy(index: number): number {
    return index;
  }
}
