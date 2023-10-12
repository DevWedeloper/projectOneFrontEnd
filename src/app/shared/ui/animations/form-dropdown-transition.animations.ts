import { trigger, style, animate, transition } from '@angular/animations';

export const formDropdownAnimation = trigger('slide', [
  transition(':enter', [
    style({ height: '0', overflow: 'hidden' }),
    animate('300ms ease-in-out', style({ height: '*' })),
  ]),
  transition(':leave', [
    style({ height: '*', overflow: 'hidden' }),
    animate('300ms ease-in-out', style({ height: '0' })),
  ]),
]);
