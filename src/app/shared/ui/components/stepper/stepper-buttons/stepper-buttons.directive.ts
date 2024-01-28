import { Directive, HostListener, inject } from '@angular/core';
import { StepperService } from '../stepper.service';

@Directive({
  selector: '[appStepperNext]',
  standalone: true,
})
export class StepperNextDirective {
  private stepperService = inject(StepperService);

  @HostListener('click') onClick(): void {
    this.stepperService.next();
  }
}

@Directive({
  selector: '[appStepperPrevious]',
  standalone: true,
})
export class StepperPreviousDirective {
  private stepperService = inject(StepperService);

  @HostListener('click') onClick(): void {
    this.stepperService.previous();
  }
}
