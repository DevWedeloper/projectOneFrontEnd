import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-wildcard',
  templateUrl: './wildcard.component.html',
  styleUrls: ['./wildcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class WildcardComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  url = new BehaviorSubject<string>('');

  constructor() {
    this.route.url.pipe(takeUntilDestroyed()).subscribe((segments) => {
      this.url.next(segments.map((segment) => segment.path).join('/'));
    });
  }
}
