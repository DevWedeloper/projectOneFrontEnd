import { Route } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';

export const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [LoginGuard],
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
      },
      {
        path: 'characters',
        loadComponent: () =>
          import('./characters/characters.component').then(
            (m) => m.CharactersComponent,
          ),
      },
      {
        path: 'guilds',
        loadComponent: () =>
          import('./guilds/guilds.component').then((m) => m.GuildsComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./wildcard/wildcard.component').then((m) => m.WildcardComponent),
  },
];
