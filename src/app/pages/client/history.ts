import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { Product, ProductService } from '../service/product.service';
import { ReparationCl, ReparationClService } from '../../services/reparation/reparation.service';
import { FormatMontantPipe } from '../service/formattermontant.services';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        FormatMontantPipe,
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        ConfirmDialogModule,
        ProgressBarModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
    <div class="card">
        <p-toast position="top-center"></p-toast>
        <p-table
            #dt
            [value]="reparations"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['dateDebut', 'coutFinal', 'etat']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Affichage {first} de {last} à {totalRecords} intervention"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption >
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Historique</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Rechercher..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th></th>
                    <th pSortableColumn="dateDebut" style="min-width:16rem">
                        Date Debut
                        <p-sortIcon field="dateDebut" />
                    </th>
                    <th pSortableColumn="dateDebut" style="min-width:16rem">
                        Date Fin
                        <p-sortIcon field="dateDebut" />
                    </th>
                    <th style="min-width:10rem">
                        Description
                        
                    </th>
                    <th styl pSortableColumn="coutFinal" style="min-width:10rem; text-align: right;">
                        Cout Final
                        <p-sortIcon field="coutFinal" />
                    </th>
                    <th pSortableColumn="etat" style="min-width: 12rem ; text-align: right;">
                        État
                        <p-sortIcon field="etat" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>

            <!-- Contenu table -->
            <ng-template #body let-rep>
                <tr>
                    <td></td>
                    <td style="min-width: 16rem">{{ rep.dateDebut | date: 'dd-MM-yyyy HH:mm' }}</td>
                    <td style="min-width: 16rem">{{ rep.dateFin | date: 'dd-MM-yyyy HH:mm' }}</td>
                    <td>{{ rep.descriptionProbleme }}</td>
                    <td style="text-align: right;">{{rep.coutFinal | formatMontant }} Ar</td>
                    <td style="text-align: right;">
                        <p-tag [value]="rep.etat" [severity]="mapSeverity(getSeverity(rep.etat))" />
                    </td>
                    <td>
                        <!-- <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="viewDetail(product)" /> -->
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-confirmdialog [style]="{ width: '450px' }" />
        </div>
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class History implements OnInit {
    reparations: ReparationCl[] = []

    reparation!: ReparationCl

    @ViewChild('dt') dt!: Table;

    constructor(
        private reparationService: ReparationClService,
    ) { }

    ngOnInit() {
        this.loadReparations();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    loadReparations() {
        this.reparationService.getHistorique().subscribe((data) => {
            this.reparations = data;
            console.log('Données de réparation:', this.reparations);
        });
    }


    getSeverity(status: string) {
        switch (status) {
            case 'En cours':
                return 'blue';
            case 'Terminé':
                return 'green';
            case 'En attente':
                return 'yellow';
            case 'Annulé':
                return 'red';
            case 'Pret':
                return 'orange';
            default:
                return 'info';
        }
    }

    mapSeverity(severity: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (severity) {
            case 'blue':
                return 'info';
            case 'green':
                return 'success';
            case 'yellow':
                return 'warn';
            case 'red':
                return 'danger';
            case 'orange':
                return 'secondary';
            default:
                return 'info';
        }
    }

    exportPdf() {

    }
}
