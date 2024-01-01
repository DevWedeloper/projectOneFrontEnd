import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[appValidatorMessageContainer]',
  standalone: true,
  exportAs: 'validatorMessageContainer',
})
export class ValidatorMessageContainerDirective {
  container = inject(ViewContainerRef);
}
