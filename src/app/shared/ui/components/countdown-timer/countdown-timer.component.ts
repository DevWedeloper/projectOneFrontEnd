import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  booleanAttribute,
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
  @Input({ required: true }) label!: string;
  @Input({ required: true }) timeInSeconds!: number;
  @Input({ transform: booleanAttribute }) autoStart = false;
  @HostBinding('class.disabled') countdownActive: boolean = false;
  @HostListener('click') onClick(): void {
    this.startCountdown();
  }
  @HostBinding('tabindex') tabIndex = 0;
  countdown$ = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    this.countdown$.next(this.timeInSeconds);
    if (this.autoStart) {
      this.startCountdown();
    }
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
      this.countdown$.next(this.timeInSeconds);
    }
  }
}
