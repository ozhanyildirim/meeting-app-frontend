import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/meetings', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'meetings',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/meetings/list/meeting-list.component').then(m => m.MeetingListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./features/meetings/create/meeting-form.component').then(m => m.MeetingFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/meetings/detail/meeting-detail.component').then(m => m.MeetingDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/meetings/create/meeting-form.component').then(m => m.MeetingFormComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/meetings' }
];
