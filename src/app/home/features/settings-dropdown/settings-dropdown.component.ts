import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Renderer2, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ThemeService } from 'src/app/shared/data-access/theme.service';
import { HomeService } from '../../data-access/home.service';

@Component({
  selector: 'app-settings-dropdown',
  standalone: true,
  imports: [CommonModule],
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
        style({ opacity: 1, transform: 'translateY(0)', pointerEvents: 'none' }),
        animate('150ms', style({ opacity: 0, transform: 'translateY(-10px)', pointerEvents: 'none' })),
      ]),
    ]),
  ],
})
export class SettingsDropdownComponent {
  ts = inject(ThemeService);
  authService = inject(AuthService);
  hs = inject(HomeService);
  renderer = inject(Renderer2);
  elementRef = inject(ElementRef);
  @HostBinding('@fadeInOut') animateElement = true;

  themeOnClick(): void {
    this.ts.darkMode$.next(!this.ts.darkMode$.value);
    if (this.ts.darkMode$.value) {
      this.renderer.addClass(document.body, 'dark-theme');
      localStorage.setItem('preferredTheme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('preferredTheme', 'light');
    }
    this.ts.styles$.next(getComputedStyle(document.body));
  }
  
  logout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    this.authService.logout();
  }
  
}
