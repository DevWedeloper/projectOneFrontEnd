import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  isSettingsDropdownOpen$ = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = new BehaviorSubject<boolean>(false);
}
