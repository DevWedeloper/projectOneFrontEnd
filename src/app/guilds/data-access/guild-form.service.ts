import { Injectable, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { validateName } from 'src/app/shared/utils/validate-name.utils';

@Injectable({
  providedIn: 'root'
})
export class GuildFormService {
  fb = inject(FormBuilder);

  initializeGuildForm() {
    return this.fb.group({
      name: ['', [Validators.required, validateName]],
      leader: ['', [Validators.required]],
    });
  }

}
