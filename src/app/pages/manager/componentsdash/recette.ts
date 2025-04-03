import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StatistiqueService } from '../../../services/stat/statistique.service';
import { FormatMontantPipe } from '../../service/formattermontant.services';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule,FormatMontantPipe],
    template: ` <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Recette 2025</div>
            <!-- <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div> -->
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Janvier</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.janvier > 0" class="text-green-500 ml-4 font-medium"> {{ data.janvier | formatMontant }}</span>
                <span *ngIf="data.janvier <= 0" class="text-red-500 ml-4 font-medium">{{ data.janvier | formatMontant }}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Fevrier</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.fevrier > 0" class="text-green-500 ml-4 font-medium"> {{ data.fevrier | formatMontant}}</span>
                <span *ngIf="data.fevrier <= 0" class="text-red-500 ml-4 font-medium">{{ data.fevrier | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Mars</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.mars > 0" class="text-green-500 ml-4 font-medium"> {{ data.mars | formatMontant}}</span>
                <span *ngIf="data.mars <= 0" class="text-red-500 ml-4 font-medium">{{ data.mars | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Avril</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.avril > 0" class="text-green-500 ml-4 font-medium"> {{ data.avril| formatMontant }}</span>
                <span *ngIf="data.avril <= 0" class="text-red-500 ml-4 font-medium">{{ data.avril | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Mai</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.mai > 0" class="text-green-500 ml-4 font-medium"> {{ data.mai | formatMontant}}</span>
                <span *ngIf="data.mai <= 0" class="text-red-500 ml-4 font-medium">{{ data.mai | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Juin</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <span *ngIf="data.juin > 0" class="text-green-500 ml-4 font-medium"> {{ data.juin| formatMontant}}</span>
                    <span *ngIf="data.juin <= 0" class="text-red-500 ml-4 font-medium">{{ data.juin | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Juillet</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.juillet > 0" class="text-green-500 ml-4 font-medium"> {{ data.juillet | formatMontant}}</span>
                <span *ngIf="data.juillet <= 0" class="text-red-500 ml-4 font-medium">{{ data.juillet | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Aout</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.aout > 0" class="text-green-500 ml-4 font-medium"> {{ data.aout | formatMontant}}</span>
                <span *ngIf="data.aout <= 0" class="text-red-500 ml-4 font-medium">{{ data.aout | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Septembre</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.septembre > 0" class="text-green-500 ml-4 font-medium"> {{ data.septembre | formatMontant}}</span>
                <span *ngIf="data.septembre <= 0" class="text-red-500 ml-4 font-medium">{{ data.septembre | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Octobre</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.octobre > 0" class="text-green-500 ml-4 font-medium"> {{ data.octobre | formatMontant}}</span>
                <span *ngIf="data.octobre <= 0" class="text-red-500 ml-4 font-medium">{{ data.octobre | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Novembre</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.novembre > 0" class="text-green-500 ml-4 font-medium"> {{ data.novembre| formatMontant }}</span>
                <span *ngIf="data.novembre <= 0" class="text-red-500 ml-4 font-medium">{{ data.novembre | formatMontant}}</span>
                </div>
            </li>
            <hr>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Decembre</span>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                <span *ngIf="data.decembre > 0" class="text-green-500 ml-4 font-medium"> {{ data.decembre | formatMontant}}</span>
                <span *ngIf="data.decembre <= 0" class="text-red-500 ml-4 font-medium">{{ data.decembre | formatMontant}}</span>
                </div>
            </li>

        </ul>
    </div>`
})
export class BestSellingWidget implements OnInit {

    data = {
        janvier: 0,
        fevrier: 0,
        mars: 0,
        avril: 0,
        mai: 0,
        juin: 0,
        juillet: 0,
        aout: 0,
        septembre: 0,
        octobre: 0,
        novembre: 0,
        decembre: 0
    }

    terminer: string = "terminé"
    pret: string = "pret"
    total: string = "total"

    constructor(
        private statistique: StatistiqueService,

    ) { }

    ngOnInit(): void {
        this.loadStatistique()
    }

    loadStatistique() {
        this.statistique.getRecette(2025).subscribe((d) => {
            this.data = d
        }
        )
    }
}
