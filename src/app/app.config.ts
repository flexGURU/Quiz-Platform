import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageModule } from 'primeng/message';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    MessageModule,
    provideHttpClient(withFetch()),
    provideAnimations(),
    BrowserAnimationsModule,
    BrowserModule,
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
