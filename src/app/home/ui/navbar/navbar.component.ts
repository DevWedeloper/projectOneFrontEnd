import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { ThemeService } from 'src/app/shared/data-access/theme.service';
import { HomeService } from '../../data-access/home.service';
import { SettingsDropdownComponent } from '../settings-dropdown/settings-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SettingsDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  hs = inject(HomeService);
  ts = inject(ThemeService);

  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < 768;
  }
}