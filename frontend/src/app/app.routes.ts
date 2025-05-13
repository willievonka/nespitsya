import { Routes } from '@angular/router';
import { accountRoutes } from './children/account.page/account.page.routes';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // [ ] TODO: повесить гарды на страницы аккаунта и аутентификации
    {
        path: 'account',
        loadComponent: () => import('./children/account.page/account.page.component').then(m => m.AccountPageComponent),
        children: accountRoutes
    },
    { 
        path: 'auth', 
        loadComponent: () => import('./children/auth.page/auth.page.component').then(m => m.AuthPageComponent)
    },
    { 
        path: 'home', 
        loadComponent: () => import('./children/home.page/home.page.component').then(m => m.HomePageComponent)
    },
    { 
        path: 'home/cities', 
        loadComponent: () => import('./children/home.page/children/cities.page/cities.page.component').then(m => m.CitiesPageComponent)
    },
    { 
        path: 'home/cities/:city-id', 
        loadComponent: () => import('./children/home.page/children/cities.page/children/events.page/events.page.component').then(m => m.EventsPageComponent)
    },
    {
        path: 'home/cities/:city-id/:event-id',
        loadComponent: () => import ('./children/home.page/children/cities.page/children/events.page/children/event.page/event.page.component').then(m => m.EventPageComponent)
    },
    { 
        path: 'home/feedback', 
        loadComponent: () => import('./children/home.page/children/feedback.page/feedback.page.component').then(m => m.FeedbackPageComponent) 
    },
];
