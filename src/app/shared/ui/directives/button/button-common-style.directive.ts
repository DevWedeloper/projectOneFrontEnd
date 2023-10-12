import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  standalone: true
})
export class ButtonCommonStyleDirective { 
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  
  constructor() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'padding', '0.5rem');
    this.renderer.setStyle(this.elementRef.nativeElement, 'border-radius', '0.5rem');
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'white');
  }
}