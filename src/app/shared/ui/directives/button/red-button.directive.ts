import { Directive, ElementRef, Renderer2, inject } from '@angular/core';
import { FocusVisibleDirective } from '../focus-visible.directive';
import { ButtonCommonStyleDirective } from './button-common-style.directive';

@Directive({
  selector: '[appRedButton]',
  standalone: true,
  hostDirectives: [ButtonCommonStyleDirective, FocusVisibleDirective],
})
export class RedButtonDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  constructor() {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      'red',
    );
  }
}
