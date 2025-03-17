import { Component } from '@angular/core';
import { NotificationsWidget } from './componentsdash/notificationswidget';
import { RecentSalesWidget } from './componentsdash/recentsaleswidget';

@Component({
    selector: 'app-dashboard',
    imports: [RecentSalesWidget, NotificationsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
