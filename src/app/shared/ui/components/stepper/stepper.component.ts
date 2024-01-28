import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  inject,
} from '@angular/core';
import { StepperService } from './stepper.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  animations: [
    trigger('slideAnimation', [
      state('void', style({ transform: 'translateX(0)' })),
      transition(':increment', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements AfterViewInit {
  protected stepperService = inject(StepperService);

  @ContentChildren('stepperTemplate') stepper!: QueryList<
    TemplateRef<HTMLElement>
  >;

  ngAfterViewInit(): void {
    this.stepperService.stepperLength$.next(this.stepper.length);
  }
}
