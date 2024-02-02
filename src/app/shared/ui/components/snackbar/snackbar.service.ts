import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  inject,
} from '@angular/core';
import { SnackbarConfig } from './snackbar-config.type';
import { SnackbarComponent } from './snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService<T> {
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  private snackbarComponentRef?: ComponentRef<SnackbarComponent>;

  open(message: string, config?: SnackbarConfig): void {
    if (this.snackbarComponentRef) {
      this.appRef.detachView(this.snackbarComponentRef.hostView);
      this.snackbarComponentRef?.destroy();
    }

    const factory =
      this.componentFactoryResolver.resolveComponentFactory(SnackbarComponent);

    this.snackbarComponentRef = factory.create(this.injector);

    this.snackbarComponentRef.instance.message = message;
    this.snackbarComponentRef.instance.config = config;

    this.appRef.attachView(this.snackbarComponentRef.hostView);

    const domElem = (this.snackbarComponentRef.hostView as EmbeddedViewRef<T>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    setTimeout(() => {
      if (this.snackbarComponentRef) {
        this.appRef.detachView(this.snackbarComponentRef.hostView);
        this.snackbarComponentRef?.destroy();
      }
    }, 3000);
  }
}
