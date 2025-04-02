import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../app.menuitem';

@Component({
    selector: 'app-menu-manager',
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
                label: 'Pages Manager',
                icon: 'pi pi-fw pi-briefcase',
                // routerLink: ['/pages'],
                items: [
                    {
                        label: 'Tableau de bord',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['manager/dashboard']
                    },
                    // {
                    //     label: 'Mécaniciens',
                    //     icon: 'pi pi-fw pi-users',
                    //     routerLink: ['manager/mechanics']
                    // },
                    {
                        label: 'Pièces',
                        icon: 'pi pi-fw pi-cog',
                        // routerLink: ['manager/pieces']
                        items: [
                            {
                                label: 'Liste',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['manager/pieces']
                            },
                            {
                                label: 'Commande',
                                icon: 'pi pi-fw pi-shopping-cart',
                                routerLink: ['manager/order']
                            }
                        ]
                    }
                    // {
                    //     label: 'Recettes',
                    //     icon: 'pi pi-fw pi-money-bill',
                    //     routerLink: ['manager/receipts']
                    // }
                ]
            }
            /* {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            */
        ];
    }
}
