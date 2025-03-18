import { Routes } from '@angular/router';
import { AppLayout_Client } from './app/layout/component_client/app.layout';
import { AppLayout_Manager } from './app/layout/component_manager/app.layout';
import { AppLayout_Mechanics } from './app/layout/component_mechanics/app.layout';
// import { Dashboard } from './app/pages/dashboard/dashboard';
import { Login } from './app/pages/auth/login';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/services/user/auth.guard';

export const appRoutes: Routes = [
    { path: '', component: Login },
    {
        path: '',
        component: AppLayout_Client,
        canActivate: [],
        children: [
            { path: 'client', loadChildren: () => import('./app/pages/pages.routes_client') }
        ]
    },

    {
        path: '',
        component: AppLayout_Manager,
        canActivate: [],
        children: [
            { path: 'manager', loadChildren: () => import('./app/pages/pages.routes_manager') }
        ]
    },

    {
        path: '',
        component: AppLayout_Mechanics,
        canActivate: [],
        children: [
            { path: 'mechanics', loadChildren: () => import('./app/pages/pages.routes_mechanics') }
        ]
    },

    
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
