import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-wildcard',
  templateUrl: './wildcard.component.html',
  styleUrls: ['./wildcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class WildcardComponent {
  private route = inject(ActivatedRoute);
  protected url = new BehaviorSubject<string>('');

  constructor() {
    this.route.url.pipe(takeUntilDestroyed()).subscribe((segments) => {
      this.url.next(segments.map((segment) => segment.path).join('/'));
    });
  }
}
