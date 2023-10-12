import { trigger, style, animate, transition } from '@angular/animations';

export const smoothTransitionAnimation = trigger('smoothTransition', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-in-out', style({ opacity: 1 })),
  ]),
]);
