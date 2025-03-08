import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Calendar } from './client/calendar';
import { History } from './client/history';
import { Intervention } from './client/intervention';
import { Dashboard as ManagerDashboard } from './manager/dashboard';
import { Dashboard as MechanicsDashboard } from './mechanics/dashboard';
import { Mechanics } from './manager/mechanics';
import { Pieces as ManagerPieces } from './manager/pieces';
import { Pieces as MechanicsPieces } from './mechanics/pieces';
import { Receipts } from './manager/receipts';
import { Empty } from './empty/empty';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'client/calendar', component: Calendar },
    { path: 'client/history', component: History },
    { path: 'client/intervention', component: Intervention },
    { path: 'manager/dashboard', component: ManagerDashboard },
    { path: 'mechanics/dashboard', component: MechanicsDashboard },
    { path: 'manager/mechanics', component: Mechanics },
    { path: 'manager/pieces', component: ManagerPieces },
    { path: 'mechanics/pieces', component: MechanicsPieces },
    { path: 'manager/receipts', component: Receipts },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
