import { Routes } from '@angular/router';
import { Calendar } from './client/calendar';
import { History } from './client/history';
import { Vehicule } from './client/vehicule';
import { Intervention } from './client/intervention';
import { Dashboard as ManagerDashboard } from './manager/dashboard';
import { Dashboard as MechanicsDashboard } from './mechanics/dashboard';
import { Mechanics } from './manager/mechanics';
import { Pieces as ManagerPieces } from './manager/pieces';
import { Pieces as MechanicsPieces } from './mechanics/pieces';
import { Receipts } from './manager/receipts';
import { Order } from './manager/order';

export default [
    { path: 'dashboard', component: MechanicsDashboard },
    { path: 'pieces', component: MechanicsPieces },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
