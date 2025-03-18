import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})

// *Sidebar Menu
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                /* label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }] */
            },
            {
                label: 'Pages Client',
                icon: 'pi pi-fw pi-briefcase',
                // routerLink: ['/pages'],
                items: [
                    {
                        label: 'Véhicule',
                        icon: 'pi pi-fw pi-car',
                        routerLink: ['client/vehicule']
                    },
                    {
                        label: 'Intervention',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        items: [
                            {
                                label: 'Liste',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['client/intervention']
                            },
                            {
                                label: 'Historique',
                                icon: 'pi pi-fw pi-history',
                                routerLink: ['client/history']
                            }
                        ]
                    },
                    {
                        label: 'Calendrier',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['client/calendar']
                    }
                ]
            }
        ];
    }
}
