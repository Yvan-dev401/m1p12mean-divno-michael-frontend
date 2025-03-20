import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar-manager',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu-manager></app-menu-manager>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
