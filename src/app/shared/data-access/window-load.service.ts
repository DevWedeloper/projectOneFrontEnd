import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowLoadService {
  windowLoad = signal<boolean>(false);
}
