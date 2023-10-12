import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode$ = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.darkMode$.asObservable();
  styles$ = new BehaviorSubject<CSSStyleDeclaration | null>(null);
}
