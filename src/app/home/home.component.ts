import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../shared/data-access/theme.service';
import { HomeService } from './data-access/home.service';
import { SettingsDropdownComponent } from './features/settings-dropdown/settings-dropdown.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet, SettingsDropdownComponent, RouterLinkActive]
})
export class HomeComponent {
  hs = inject(HomeService);
  renderer = inject(Renderer2);
  mediaMatcher = inject(MediaMatcher);
  ts = inject(ThemeService);
  authService = inject(AuthService);
  isSidebarOpen = false;

  mobileQuery = this.mediaMatcher.matchMedia('(max-width: 768px)');

  constructor() {
    this.checkPreferredTheme();
    this.authService.autoLogout();
    this.authService.setUserRole();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  checkPreferredTheme(): void {
    const preferredTheme = localStorage.getItem('preferredTheme');
    if (preferredTheme === 'dark') {
      this.ts.darkMode$.next(true);
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.ts.darkMode$.next(false);
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  closeMenu(): void {
    this.isSidebarOpen = false;
  }
  
}
