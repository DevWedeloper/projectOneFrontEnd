import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  inject,
  viewChildren,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/auth/state/auth.actions';
import { ThemeService } from 'src/app/shared/data-access/theme.service';
import { HomeService } from '../../data-access/home.service';

@Component({
  selector: 'app-settings-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './settings-dropdown.component.html',
  styleUrls: ['./settings-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('150ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
          pointerEvents: 'none',
        }),
        animate(
          '150ms',
          style({
            opacity: 0,
            transform: 'translateY(-10px)',
            pointerEvents: 'none',
          }),
        ),
      ]),
    ]),
  ],
})
export class SettingsDropdownComponent implements OnDestroy {
  protected ts = inject(ThemeService);
  private hs = inject(HomeService);
  private store = inject(Store);
  private router = inject(Router);
  @HostBinding('@fadeInOut') animateElement = true;
  private links = viewChildren<ElementRef>('ElementRef');
  private skipInitialCheck = true;

  ngOnDestroy(): void {
    this.hs.isSettingsDropdownOpen$.next(false);
  }

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusIn(event: Event) {
    if (this.skipInitialCheck) {
      this.skipInitialCheck = false;
      return;
    }
    if (
      !this.links().some((child) =>
        child.nativeElement.contains(event.target as Node),
      )
    ) {
      this.hs.isSettingsDropdownOpen$.next(false);
    }
  }

  navigateToAccount() {
    this.router.navigate(['/account']);
  }

  onLogout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    this.store.dispatch(authActions.logout());
  }
}
