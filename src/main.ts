import { ApplicationRef } from '@angular/core';
import {
  bootstrapApplication,
  enableDebugTools,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then((module) =>
    enableDebugTools(module.injector.get(ApplicationRef).components[0])
  )
  .catch((err) => console.log(err));
