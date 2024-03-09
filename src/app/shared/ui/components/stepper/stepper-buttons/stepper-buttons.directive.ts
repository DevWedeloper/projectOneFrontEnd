import { Directive, inject } from '@angular/core';
import { StepperService } from '../stepper.service';

@Directive({
  selector: '[appStepperNext]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class StepperNextDirective {
  private stepperService = inject(StepperService);

  protected onClick(): void {
    this.stepperService.next();
  }
}

@Directive({
  selector: '[appStepperPrevious]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class StepperPreviousDirective {
  private stepperService = inject(StepperService);

  protected onClick(): void {
    this.stepperService.previous();
  }
}
