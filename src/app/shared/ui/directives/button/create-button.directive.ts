import { Directive, ElementRef, Renderer2, inject } from '@angular/core';
import { FocusVisibleDirective } from '../focus-visible.directive';

@Directive({
  selector: '[appCreateButton]',
  standalone: true,
  hostDirectives: [FocusVisibleDirective],
})
export class CreateButtonDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  constructor() {
    this.renderer.addClass(this.elementRef.nativeElement, 'create-btn');
  }
}
