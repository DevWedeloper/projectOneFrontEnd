import { InjectionToken } from '@angular/core';

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string } = {
  required: () => 'This field is required',
  requiredTrue: () => 'This field is required',
  email: () => 'It should be a valid email',
  minlength: ({ requiredLength }) =>
    `The length should be at least ${requiredLength} characters`,
  maxlength: ({ requiredLength }) =>
    `The length should be at most ${requiredLength} characters`,
  min: ({ min }) => `The value should be at least ${min}`,
  max: ({ max }) => `The value should be at most ${max}`,
  pattern: () => 'Only letters, numbers, and underscore',
  uniqueName: () => 'Already taken',
  notFound: () => 'Not found',
  alreadyMember: () => 'Already a member',
  notMember: () => 'Not a member',
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(
  'Validation Messages',
  {
    providedIn: 'root',
    factory: () => ERROR_MESSAGES,
  }
);