import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChildren,
  effect,
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
export class StepperComponent {
  protected stepperService = inject(StepperService);
  protected stepper =
    contentChildren<TemplateRef<HTMLElement>>('stepperTemplate');

  constructor() {
    effect(() => {
      this.stepperService.stepperLength$.next(this.stepper().length);
    });
  }
}
