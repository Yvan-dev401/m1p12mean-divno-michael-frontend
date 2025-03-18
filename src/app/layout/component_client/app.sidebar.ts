import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar-client',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu-client></app-menu-client>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
