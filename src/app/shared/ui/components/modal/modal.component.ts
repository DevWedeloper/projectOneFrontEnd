import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
  TemplateRef,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { ThemeService } from 'src/app/shared/data-access/theme.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('hostAnimation', [
      transition(':leave', [query('@fadeInOut', animateChild())]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.1)' }),
        animate('200ms', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('200ms', style({ opacity: 0, transform: 'translateY(-2rem)' })),
      ]),
    ]),
  ],
})
export class ModalComponent implements AfterViewInit {
  protected ms = inject(ModalService);
  protected ts = inject(ThemeService);
  private renderer = inject(Renderer2);
  contentTemplate = input.required<TemplateRef<HTMLElement>>();
  @HostBinding('@hostAnimation') animate = true;
  @ViewChild('modalElement') private modalElement!: ElementRef;

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.modalElement.nativeElement).focus();
  }

  @HostListener('document:keydown.escape', ['$event']) onEscapeKeydown() {
    this.ms.close();
  }
}
