import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/data-access/theme.service';
import { WindowLoadService } from './shared/data-access/window-load.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet/>',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window: load)': 'onWindowLoad()',
  },
})
export class AppComponent {
  title = 'projectOne';
  private ts = inject(ThemeService);
  private wls = inject(WindowLoadService);

  constructor() {
    afterNextRender(() => {
      this.ts.checkPreferredTheme();
    });
  }

  protected onWindowLoad(): void {
    this.wls.windowLoad.set(true);
  }
}
