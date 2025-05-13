import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'favorites',
        loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent)
    },
    {
        path: 'subscriptions',
        loadComponent: () => import('./components/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
    },
    {
        path: 'my-events',
        loadComponent: () => import('./components/my-events/my-events.component').then(m => m.MyEventsComponent)
    },
    {
        path: 'create-event',
        loadComponent: () => import('./components/create-event/create-event.component').then(m => m.CreateEventComponent)
    }
];