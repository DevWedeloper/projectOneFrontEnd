import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appFocusVisible]',
  standalone: true,
})
export class FocusVisibleDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  constructor() {
    this.renderer.addClass(
      this.elementRef.nativeElement,
      'custom-focus-visible',
    );
  }
}
