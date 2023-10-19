import { Directive, ElementRef, Renderer2, inject } from '@angular/core';
import { FocusVisibleDirective } from '../focus-visible.directive';
import { ButtonCommonStyleDirective } from './button-common-style.directive';

@Directive({
  selector: '[appGreenButton]',
  standalone: true,
  hostDirectives: [ButtonCommonStyleDirective, FocusVisibleDirective]
})
export class GreenButtonDirective { 
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  
  constructor() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#5cb85c');
  }
}