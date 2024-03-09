import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../shared/data-access/theme.service';
import { HomeService } from '../../data-access/home.service';
import { SettingsDropdownComponent } from '../settings-dropdown/settings-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SettingsDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class NavbarComponent {
  protected hs = inject(HomeService);
  protected ts = inject(ThemeService);
  protected isMobile = window.innerWidth < 768;

  protected onResize(): void {
    this.isMobile = window.innerWidth < 768;
  }
}
