import { Injectable, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GuildFormService {
  fb = inject(FormBuilder);

  initializeGuildForm() {
    return this.fb.group({
      name: ['', [Validators.required]],
      leader: ['', [Validators.required]],
    });
  }

}
