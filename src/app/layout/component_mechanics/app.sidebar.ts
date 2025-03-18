import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar-mechanics',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu-mechanics></app-menu-mechanics>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
