import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ThemeService } from 'src/app/shared/data-access/theme.service';

@Injectable({
  providedIn: 'root',
})
export class ChartColorService {
  private ts = inject(ThemeService);
  private style = getComputedStyle(document.body);
  readonly secondaryColor$ = new BehaviorSubject<string>('');
  readonly textColor$ = new BehaviorSubject<string>('');
  readonly getStyle$ = combineLatest([this.ts.styles$]).pipe(
    map(([styles]) => {
      this.secondaryColor$.next(
        styles?.getPropertyValue('--secondary-color') ||
          this.style.getPropertyValue('--secondary-color'),
      );
      this.textColor$.next(
        styles?.getPropertyValue('--text-color') ||
          this.style.getPropertyValue('--text-color'),
      );
    }),
  );
  readonly healthColor = 'lightgreen';
  readonly strengthColor = 'lightblue';
  readonly agilityColor = 'pink';
  readonly intelligenceColor = 'yellow';
  readonly armorColor = 'brown';
  readonly critChanceColor = 'orange';
}
