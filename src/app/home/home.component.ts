import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from '../auth/state/auth.actions';
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
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
})
export class HomeComponent {
  private ts = inject(ThemeService);
  protected hs = inject(HomeService);
  private store = inject(Store);

  constructor() {
    this.ts.checkPreferredTheme();
    this.store.dispatch(authActions.autoLogout());
    this.store.dispatch(authActions.getUserRole());
  }
}
