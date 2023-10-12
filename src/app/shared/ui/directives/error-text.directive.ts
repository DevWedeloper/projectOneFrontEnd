import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appErrorText]',
  standalone: true
})
export class ErrorTextDirective {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  
  constructor() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'red');
    this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', '5px');
  }
}
