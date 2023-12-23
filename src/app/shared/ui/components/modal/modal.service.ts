import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, TemplateRef, inject } from '@angular/core';
import { ModalComponent } from './modal.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService<T> {
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  private modalComponentRef?: ComponentRef<ModalComponent>;
  isOpen$ = new BehaviorSubject<boolean>(false);

  open(contentTemplate: TemplateRef<HTMLElement>): void {
    // Destroy previous modal if it exists
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef?.destroy();
    }

    // Create a component factory
    const factory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

    // Create a component reference
    this.modalComponentRef = factory.create(this.injector);

    // Attach the component to the application ref so that it's part of the Angular application
    this.appRef.attachView(this.modalComponentRef.hostView);

    // Get the DOM element from the component
    const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<T>).rootNodes[0] as HTMLElement;

    // Append the DOM element to the body
    document.body.appendChild(domElem);

    // Pass the content template to the modal component
    this.modalComponentRef.instance.contentTemplate = contentTemplate;

    this.isOpen$.next(true);
  }

  close(): void {
    if (this.modalComponentRef) {
      // Remove the modal component from the body
      this.isOpen$.next(false);
      setTimeout(() => {
        if (this.modalComponentRef) {
          this.appRef.detachView(this.modalComponentRef.hostView);
          this.modalComponentRef?.destroy();
        }
      }, 200);
    }
  }
}
