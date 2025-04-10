import { Routes } from '@angular/router';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { 
        path: 'home', 
        loadComponent: () => import('./components/pages/home.page/home.page.component').then(m => m.HomePageComponent)
    },
    { 
        path: 'home/cities', 
        loadComponent: () => import('./components/pages/cities.page/cities.page.component').then(m => m.CitiesPageComponent)
    },
    { 
        path: 'home/cities/:id', 
        loadComponent: () => import('./components/pages/events.page/events.page.component').then(m => m.EventsPageComponent)
    },
    { 
        path: 'home/feedback', 
        loadComponent: () => import('./components/pages/feedback.page/feedback.page.component').then(m => m.FeedbackPageComponent) 
    },
];
