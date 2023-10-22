import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateName } from 'src/app/shared/utils/validate-name.utils';

@Injectable({
  providedIn: 'root',
})
export class CharacterFormService {
  fb = inject(FormBuilder);

  initializeCharacterForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, validateName]],
      characterType: ['', [Validators.required]],
      health: [
        null,
        [Validators.required, Validators.min(1000), Validators.max(10000)],
      ],
      strength: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      agility: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      intelligence: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      armor: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      critChance: [
        null,
        [Validators.required, Validators.min(0.01), Validators.max(1)],
      ],
    });
  }
}
