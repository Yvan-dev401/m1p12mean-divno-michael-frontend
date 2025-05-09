import { Routes } from '@angular/router';
import { Calendar } from './client/calendar';
import { History } from './client/history';
import { ListeVehicule } from './client/vehicule';
import { Intervention } from './client/intervention';

export default [
    { path: 'calendar', component: Calendar },
    { path: 'history', component: History },
    { path: 'intervention', component: Intervention },
    { path: 'vehicule', component: ListeVehicule },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
