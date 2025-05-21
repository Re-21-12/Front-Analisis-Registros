import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
    path: '',
    loadComponent: () => import('./core/pages/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'personas'
    }
  },
      /* Preregistro */
      {
        path: 'new-persona-by-user',
        loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
        data: {
          title: 'new persona',
          status_create: 'Pendiente'
        }
      },
            {
        path: 'new-persona-by-user/:id',
        loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
        data: {
          title: 'new persona',
          status_create: 'Confirmado'
        }
      },
            {
        path: 'new-persona-by-other',
        loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
        data: {
          title: 'new persona',
          status_create: 'Confirmado'
        }
      },

    ]
  }
];
