import { Routes } from '@angular/router';
import { Dashboard as ManagerDashboard } from './manager/dashboard';
import { Dashboard as MechanicsDashboard } from './mechanics/dashboard';
import { Mechanics } from './manager/mechanics';
import { Pieces as ManagerPieces } from './manager/pieces';
import { Receipts } from './manager/receipts';
import { Order } from './manager/order';

export default [
    { path: 'dashboard', component: ManagerDashboard },
    { path: 'mechanics', component: Mechanics },
    { path: 'pieces', component: ManagerPieces },
    { path: 'receipts', component: Receipts },
    { path: 'order', component: Order },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
