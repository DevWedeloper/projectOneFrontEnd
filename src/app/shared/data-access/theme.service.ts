import {
  Injectable,
  Renderer2,
  RendererFactory2,
  afterNextRender,
  inject,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private rendererFactory = inject(RendererFactory2);
  private darkThemeMediaQuery!: MediaQueryList;
  darkMode$ = new BehaviorSubject<boolean>(true);
  isDarkMode$: Observable<boolean> = this.darkMode$.asObservable();
  styles$ = new BehaviorSubject<CSSStyleDeclaration | null>(null);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    afterNextRender(() => {
      this.darkThemeMediaQuery = matchMedia('(prefers-color-scheme: dark)');
    });
  }

  themeOnClick(): void {
    this.darkMode$.next(!this.darkMode$.value);
    const preferredTheme = this.darkMode$.value ? 'dark' : 'light';

    this.renderer.removeClass(document.documentElement, 'dark-theme');
    this.renderer.removeClass(document.documentElement, 'light-theme');
    this.renderer.addClass(document.documentElement, `${preferredTheme}-theme`);

    localStorage.setItem('preferredTheme', preferredTheme);
    this.styles$.next(getComputedStyle(document.body));
  }

  checkPreferredTheme(): void {
    const preferredTheme = localStorage.getItem('preferredTheme');
    const isDarkTheme =
      preferredTheme === 'dark' ||
      (preferredTheme === null && this.darkThemeMediaQuery.matches);
    this.darkMode$.next(isDarkTheme);
  }
}
