import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  index$ = new BehaviorSubject<number>(0);
  stepperLength$ = new BehaviorSubject<number>(0);

  next(): void {
    if (this.index$.value < this.stepperLength$.value - 1) {
      this.index$.next(this.index$.value + 1);
    }
  }

  previous(): void {
    if (this.index$.value > 0) {
      this.index$.next(this.index$.value - 1);
    }
  }
}
