import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar'; // Import du module Calendar

import { StatistiqueService } from '../../../services/stat/statistique.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-mechanics',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        CalendarModule // Import du module Calendar
    ],
    // dataKey="id"
    template: ` <div class="card">
        <div class="font-semibold text-xl mb-4">Vue d'ensemble des mécaniciens</div>
        <p-table
            #dt1
            [value]="mecanicien"

            [rows]="10"
            [loading]="loading"
            [rowHover]="true"
            [showGridlines]="true"
            [paginator]="true"
            [globalFilterFields]="['nom', 'status']"
            responsiveLayout="scroll"
        >
            <ng-template #caption>
                <div class="flex justify-between items-center flex-column sm:flex-row">
                    <p-iconfield iconPosition="left" class="ml-auto">
                        <p-inputicon>
                            <i class="pi pi-search"></i>
                        </p-inputicon>
                        <input pInputText type="text" (input)="onGlobalFilter(dt1, $event)" placeholder="Recherche" />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="min-width: 12rem">
                        <div class="flex justify-between items-center">
                            Nom complet
                        </div>
                    </th>
                    <th style="min-width: 12rem">
                        <div class="flex justify-between items-center">
                            Status
                        </div>
                    </th>
                    <th style="min-width: 12rem">
                        <div class="flex justify-between items-center">
                            Productivté
                        </div>
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-mec>
                <tr>
                    <td>
                        {{ mec.nom }}
                    </td>

                    <td>
                        <p-tag *ngIf="mec.productivite>0" [value]="actif" [severity]="getSeverity(actif)" styleClass="dark:!bg-surface-900" />
                        <p-tag *ngIf="mec.productivite==0" [value]="non_actif" [severity]="getSeverity(non_actif)" styleClass="dark:!bg-surface-900" />
                    </td>
                    <td>
                        <p-progressbar [value]="mec.productivite" [showValue]="false" [style]="{ height: '0.5rem' }" />
                    </td>

                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="8">No customers found.</td>
                </tr>
            </ng-template>
            <ng-template #loadingbody>
                <tr>
                    <td colspan="8">Loading customers data. Please wait.</td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [ConfirmationService, MessageService]
})
export class Mechanics implements OnInit {



    actif: string = "actif"
    non_actif: string = "non actif"

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    data: any[] = []

    totalReparation: number = 0

    mecanicien: any[] = []

    productiviteValue: number = 0

    constructor(
        private statistique: StatistiqueService,

    ) { }

    ngOnInit(): void {
        this.loadStatistique()
    }

    calculValue(tableau: any[]) {
        for (let i = 0; i < tableau.length; i++) {
            tableau[i].productivite = (tableau[i].productivite * 100) / this.totalReparation

        }
        this.mecanicien = tableau
    }

    loadStatistique() {
        this.statistique.getProductivite().subscribe((d) => {
            this.totalReparation = d.totalReparations
            this.mecanicien = d.mecaniciens
            this.loading = false
            this.calculValue(this.mecanicien)
        }
        )
        //this.loading = false;
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverity(status: string) {
        if (status == "actif") {
            return "success"
        }
        else {
            return "danger"
        }
    }

}