import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ThemeService } from 'src/app/shared/data-access/theme.service';

@Injectable({
  providedIn: 'root',
})
export class ChartColorService {
  ts = inject(ThemeService);
  style = getComputedStyle(document.body);
  secondaryColor$ = new BehaviorSubject<string>('');
  textColor$ = new BehaviorSubject<string>('');
  getStyle$ = combineLatest([this.ts.styles$])
  .pipe(
    map(([styles]) => {
      this.secondaryColor$.next(
        styles?.getPropertyValue('--secondary-color') || this.style.getPropertyValue('--secondary-color')
      );
      this.textColor$.next(
        styles?.getPropertyValue('--text-color') || this.style.getPropertyValue('--text-color')
      );
    })
  );
  healthColor = 'lightgreen';
  strengthColor = 'lightblue';
  agilityColor = 'pink';
  intelligenceColor = 'yellow';
  armorColor = 'brown';
  critChanceColor = 'orange';
}
