import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wildcard',
  templateUrl: './wildcard.component.html',
  styleUrls: ['./wildcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class WildcardComponent {
  private route = signal<ActivatedRoute>(inject(ActivatedRoute));
  protected url = computed(() => {
    return this.route()
      .snapshot.url.map((segment) => segment.path)
      .join('/');
  });
}
