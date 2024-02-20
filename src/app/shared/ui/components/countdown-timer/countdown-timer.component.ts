import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  OnInit,
  booleanAttribute,
  input,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent implements OnInit {
  label = input.required<string>();
  timeInSeconds = input.required<number>();
  autoStart = input(false, {
    transform: booleanAttribute,
  });

  @HostBinding('class.disabled') countdownActive: boolean = false;
  @HostBinding('tabindex') get tabIndex(): number {
    return this.countdownActive ? -1 : 0;
  }
  countdown$ = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    this.countdown$.next(this.timeInSeconds());
    if (this.autoStart()) {
      this.startCountdown();
    }
  }

  @HostListener('click')
  @HostListener('keydown.Enter', ['$event'])
  onTrigger(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    if (!this.countdownActive) {
      this.countdownActive = true;
      this.updateCountdown();
    }
  }

  updateCountdown(): void {
    if (this.countdown$.value > 0) {
      setTimeout(() => {
        this.countdown$.next(this.countdown$.value - 1);
        this.updateCountdown();
      }, 1000);
    } else {
      this.countdownActive = false;
      this.countdown$.next(this.timeInSeconds());
    }
  }
}
