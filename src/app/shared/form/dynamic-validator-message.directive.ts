import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
  NgForm,
  NgModel,
} from '@angular/forms';
import { EMPTY, filter, fromEvent, iif, merge, skip, startWith } from 'rxjs';
import { ErrorStateMatcherService } from './error-state-matcher.service';
import { InputErrorComponent } from './input-error/input-error.component';

@Directive({
  selector: `
    [ngModel]:not([withoutValidationErrors]),
    [formControl]:not([withoutValidationErrors]),
    [formControlName]:not([withoutValidationErrors]),
    [formGroupName]:not([withoutValidationErrors]),
    [ngModelGroup]:not([withoutValidationErrors])
  `,
  standalone: true,
})
export class DynamicValidatorMessageDirective implements OnInit {
  private ngControl =
    inject(NgControl, { self: true, optional: true }) ||
    inject(ControlContainer, { self: true });
  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private destroyRef = inject(DestroyRef);
  private elementRef = inject(ElementRef);
  private parentContainer = inject(ControlContainer, { optional: true });
  errorStateMatcher = input<ErrorStateMatcherService>(
    inject(ErrorStateMatcherService),
  );
  container = input<ViewContainerRef>(inject(ViewContainerRef));
  private get form() {
    return this.parentContainer?.formDirective as
      | NgForm
      | FormGroupDirective
      | null;
  }

  ngOnInit(): void {
    queueMicrotask(() => {
      if (!this.ngControl.control)
        throw Error(`No control model for ${this.ngControl.name} control...`);
      merge(
        this.ngControl.control?.statusChanges,
        fromEvent(this.elementRef.nativeElement, 'blur'),
        iif(() => !!this.form, this.form!.ngSubmit, EMPTY),
      )
        .pipe(
          startWith(this.ngControl.control.status),
          skip(this.ngControl instanceof NgModel ? 1 : 0),
          filter((status) => status === 'VALID' || status === 'INVALID'),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          if (
            this.errorStateMatcher().isErrorVisible(
              this.ngControl.control,
              this.form,
            )
          ) {
            if (!this.componentRef) {
              this.componentRef =
                this.container().createComponent(InputErrorComponent);
              this.componentRef.changeDetectorRef.markForCheck();
            }
            this.componentRef.setInput('errors', this.ngControl.errors);
          } else {
            this.componentRef?.destroy();
            this.componentRef = null;
          }
        });
    });
  }
}
