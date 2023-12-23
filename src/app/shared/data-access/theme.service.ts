import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private rendererFactory = inject(RendererFactory2);
  darkMode$ = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.darkMode$.asObservable();
  styles$ = new BehaviorSubject<CSSStyleDeclaration | null>(null);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  themeOnClick(): void {
    this.darkMode$.next(!this.darkMode$.value);
    if (this.darkMode$.value) {
      this.renderer.addClass(document.body, 'dark-theme');
      localStorage.setItem('preferredTheme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('preferredTheme', 'light');
    }
    this.styles$.next(getComputedStyle(document.body));
  }

  checkPreferredTheme(): void {
    const preferredTheme = localStorage.getItem('preferredTheme');
    if (preferredTheme === 'dark') {
      this.darkMode$.next(true);
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.darkMode$.next(false);
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
