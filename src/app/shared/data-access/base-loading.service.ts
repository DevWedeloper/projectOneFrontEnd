import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseLoadingService {
  loading$ = new BehaviorSubject<boolean>(true);

  waitForObservables<T>(observables: Observable<T>[]) {
    this.loading$.next(true);
    forkJoin(observables).subscribe({
      next: () => {
        this.loading$.next(false);
      },
      error: () => {
        this.loading$.next(false);
      },
    });
  }
}
