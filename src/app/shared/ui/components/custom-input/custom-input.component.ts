import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ],
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements ControlValueAccessor {
  cdr = inject(ChangeDetectorRef);
  @Input({ required: true }) type!: string;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;
  @Input() value!: string;
  @Input() step!: number;
  @Output() focusEvent = new EventEmitter<void>();
  @Output() clickEvent = new EventEmitter<void>();

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: string) {
    this.value = input;
    this.cdr.markForCheck();
  }

  updateValue(input: string) {
    this.value = input;
    this.onChange(input);
    this.onTouch();
  }
}
