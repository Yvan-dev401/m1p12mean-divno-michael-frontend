import { Component } from '@angular/core';
import { NotificationsWidget } from './componentsdash/notifications';
import { RecentSalesWidget } from './componentsdash/recentsaleswidget';

import { StatsWidget } from './componentsdash/statswidget';
import { BestSellingWidget } from './componentsdash/recette';
import { Mechanics } from './componentsdash/mechanics';

@Component({
    selector: 'app-dashboard',
    // imports: [RecentSalesWidget, NotificationsWidget, StatsWidget,BestSellingWidget,Mechanics],
    imports: [NotificationsWidget, StatsWidget,BestSellingWidget,Mechanics],
    template: `
        <div class="grid grid-cols-12 gap-8">
        <app-stats-widget class="contents" />

            <div class="col-span-12 xl:col-span-4">
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-8">
                <app-notifications-widget />
                <br>
                <app-mechanics />
                <br>
                <!-- <app-recent-sales-widget /> -->
            </div>

        </div>
                    <!-- <div class="col-span-12 xl:col-span-6">
                
            </div> -->
    `
})
export class Dashboard {}
