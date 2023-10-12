import { Renderer2 } from '@angular/core';

export const setSelectOption = (renderer: Renderer2, selectElement: HTMLSelectElement, value: string): void => {
  const index = Array.from(selectElement.options).findIndex(option => option.value === value);
  if (index !== -1) {
    renderer.setProperty(selectElement, 'selectedIndex', index);
  }
};
