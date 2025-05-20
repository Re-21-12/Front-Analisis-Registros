import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./core/pages/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'home'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./core/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'login'
    }
  },
  {
    path: 'personas',
    children: [
      {
        path: 'new-persona',
        loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
        data: {
          title: 'new persona'
        }
      },
      {
        path: 'new-persona/:id',
        loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
        data: {
          title: 'edit persona'
        }
      },
      {
        path: 'new-persona/:id/detail',
        loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
        data: {
          title: 'detail persona'
        }
      }
    ]
  }
];
