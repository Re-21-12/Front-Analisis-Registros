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
  }
];
