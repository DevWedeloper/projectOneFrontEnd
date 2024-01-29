import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';
import { PasswordRecoveryEffects } from './auth/state/password-recovery.effects';
import {
  passwordRecoveryFeatureKey,
  passwordRecoveryReducer,
} from './auth/state/password-recovery.reducers';
import { SignUpEffects } from './auth/state/sign-up.effects';
import { signUpFeatureKey, signUpReducer } from './auth/state/sign-up.reducers';
import { CharacterActionsEffects } from './characters/state/character-actions.effects';
import {
  characterActionsFeatureKey,
  characterActionsReducer,
} from './characters/state/character-actions.reducers';
import { CharacterTableEffects } from './characters/state/character-table.effects';
import {
  characterTableFeatureKey,
  characterTableReducer,
} from './characters/state/character-table.reducers';
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
import { GuildActionsEffects } from './guilds/state/guild-actions.effects';
import {
  guildActionsFeatureKey,
  guildActionsReducer,
} from './guilds/state/guild-actions.reducers';
import { GuildTableEffects } from './guilds/state/guild-table.effects';
import {
  guildTableFeatureKey,
  guildTableReducer,
} from './guilds/state/guild-table.reducers';
import { ResetPasswordGuard } from './auth/reset-password.guard';

const mainTitle = 'ProjectOne';

export const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [LoginGuard],
    title: `${mainTitle} | Login`,
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./auth/sign-up/sign-up.component').then((m) => m.SignUpComponent),
    providers: [
      provideState(signUpFeatureKey, signUpReducer),
      provideEffects(SignUpEffects),
    ],
    canActivate: [LoginGuard],
    title: `${mainTitle} | Sign-Up`,
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
    providers: [
      provideState(passwordRecoveryFeatureKey, passwordRecoveryReducer),
      provideEffects(PasswordRecoveryEffects),
    ],
    canActivate: [LoginGuard],
    title: `${mainTitle} | Forgot Password`,
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
    providers: [
      provideState(passwordRecoveryFeatureKey, passwordRecoveryReducer),
      provideEffects(PasswordRecoveryEffects),
    ],
    canActivate: [ResetPasswordGuard],
    title: `${mainTitle} | Reset Password`,
  },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        providers: [
          provideState(dashboardFeatureKey, dashboardReducer),
          provideState(characterStatsFeatureKey, characterStatsReducer),
          provideState(guildStatsFeatureKey, guildStatsReducer),
          provideEffects(
            CharacterStatsEffects,
            GuildStatsEffects,
            DashboardEffects,
          ),
        ],
        title: `${mainTitle} | Dashboard`,
      },
      {
        path: 'characters',
        loadComponent: () =>
          import('./characters/characters.component').then(
            (m) => m.CharactersComponent,
          ),
        providers: [
          provideState(characterTableFeatureKey, characterTableReducer),
          provideState(characterActionsFeatureKey, characterActionsReducer),
          provideEffects(CharacterTableEffects, CharacterActionsEffects),
        ],
        title: `${mainTitle} | Characters`,
      },
      {
        path: 'guilds',
        loadComponent: () =>
          import('./guilds/guilds.component').then((m) => m.GuildsComponent),
        providers: [
          provideState(guildTableFeatureKey, guildTableReducer),
          provideState(guildActionsFeatureKey, guildActionsReducer),
          provideEffects(GuildTableEffects, GuildActionsEffects),
        ],
        title: `${mainTitle} | Guilds`,
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./wildcard/wildcard.component').then((m) => m.WildcardComponent),
  },
];
