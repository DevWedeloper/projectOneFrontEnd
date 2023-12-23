import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  TemplateRef,
  inject,
} from '@angular/core';
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
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef?.destroy();
    }

    const factory =
      this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

    this.modalComponentRef = factory.create(this.injector);

    this.appRef.attachView(this.modalComponentRef.hostView);

    const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<T>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    this.modalComponentRef.instance.contentTemplate = contentTemplate;

    this.isOpen$.next(true);
  }

  close(): void {
    if (this.modalComponentRef) {
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
