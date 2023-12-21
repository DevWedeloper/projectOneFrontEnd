import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../shared/data-access/theme.service';
import { HomeService } from './data-access/home.service';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { SidebarComponent } from './ui/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
})
export class HomeComponent {
  ts = inject(ThemeService);
  hs = inject(HomeService);
  renderer = inject(Renderer2);
  authService = inject(AuthService);

  constructor() {
    this.ts.checkPreferredTheme();
    this.authService.autoLogout();
    this.authService.setUserRole();
  }
}
