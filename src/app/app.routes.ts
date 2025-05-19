import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/pages/form/form.component').then(m => m.FormComponent),
    data: {
      title: 'form'
    }
  },
  {
    path: 'home',
    loadComponent: () => import('./core/pages/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'home'
    }
  },
  {
    path: 'personas',
    children:[
        {
    path: 'new-persona',
    loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'new persona'
    },

  },
          {
    path: 'new-persona:id',
    loadComponent: () => import('./core/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'edit persona'
    },

  }
    ]
  }

];
