import { Directive, ElementRef, Renderer2, inject } from '@angular/core';
import { ButtonCommonStyleDirective } from './button-common-style.directive';

@Directive({
  selector: '[appGreenButton]',
  standalone: true,
  hostDirectives: [ButtonCommonStyleDirective]
})
export class GreenButtonDirective { 
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  
  constructor() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#5cb85c');
  }
}