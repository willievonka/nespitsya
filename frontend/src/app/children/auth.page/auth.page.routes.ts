import { Routes } from '@angular/router';


export const authRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login-form/login-form.component').then(m => m.LoginFormComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/signup-form/signup-form.component').then(m => m.SignupFormComponent)
    }
];