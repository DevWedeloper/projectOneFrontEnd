import {
  animate,
  animateChild,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { SnackbarConfig } from './snackbar-config.type';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  animations: [
    trigger('hostAnimation', [
      transition(':leave', [query('@fadeInOut', animateChild())]),
    ]),
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        }),
      ),
      transition(':enter', [
        animate(
          '100ms ease-in-out',
          style({ opacity: 1, transform: 'scale(1)' }),
        ),
      ]),
      transition(':leave', [
        animate('100ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[@hostAnimation]': 'true',
    '[style.align-items]': 'justifyContent()',
    '[style.justify-content]': 'alignItems()',
  },
})
export class SnackbarComponent {
  protected snackbarService = inject(SnackbarService);
  message = input.required<string>();
  config = input<SnackbarConfig>();

  protected justifyContent() {
    switch (this.config()?.verticalPosition) {
      case 'top':
        return 'flex-start';
      case 'bottom':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  }

  protected alignItems() {
    switch (this.config()?.horizontalPosition) {
      case 'center':
        return 'center';
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  }

  protected getBackgroundColor(): string {
    switch (this.config()?.messageType) {
      case 'success':
        return 'mediumseagreen';
      case 'error':
        return 'salmon';
      case 'warn':
        return 'gold';
      default:
        return 'var(--secondary-color)';
    }
  }
}
