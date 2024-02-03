import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/data-access/theme.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet/>',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'projectOne';
  private ts = inject(ThemeService);

  constructor() {
    this.ts.checkPreferredTheme();
  }
}
