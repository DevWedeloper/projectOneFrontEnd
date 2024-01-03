import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthEffects } from './auth/state/auth.effects';
import { authFeatureKey, authReducer } from './auth/state/auth.reducers';
import { CacheInterceptor } from './caching/cache.interceptor';
import { CacheService } from './caching/cache.service';
import { CharacterStatsEffects } from './dashboard/state/character-stats.effects';
import {
  characterStatsFeatureKey,
  characterStatsReducer,
} from './dashboard/state/character-stats.reducers';
import { DashboardEffects } from './dashboard/state/dashboard.effects';
import {
  dashboardFeatureKey,
  dashboardReducer,
} from './dashboard/state/dashboard.reducers';
import { GuildStatsEffects } from './dashboard/state/guild-stats.effects';
import {
  guildStatsFeatureKey,
  guildStatsReducer,
} from './dashboard/state/guild-stats.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    CacheService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    provideAnimations(),
    provideStore(),
    provideState(authFeatureKey, authReducer),
    provideState(characterStatsFeatureKey, characterStatsReducer),
    provideState(guildStatsFeatureKey, guildStatsReducer),
    provideState(dashboardFeatureKey, dashboardReducer),
    provideEffects(
      AuthEffects,
      CharacterStatsEffects,
      GuildStatsEffects,
      DashboardEffects,
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
