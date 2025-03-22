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
import { ReparationClService, ReparationCl } from '../../services/reparation/reparation.service';
import { DevisService } from '../../services/devis/devis.service';
import { response } from 'express';

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
    selector: 'app-intervention',
    standalone: true,
    imports: [
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
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nouveau intervention" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Supprimer" icon="pi pi-trash" outlined (onClick)="deleteselectedReparation()" [disabled]="!selectedReparation || !selectedReparation.length" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="reparations"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['date', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedReparation"
            [rowHover]="true"
            dataKey="_id"
            currentPageReportTemplate="Affichage {first} de {last} à {totalRecords} intervention"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Planning</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Rechercher..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <!-- <th style="min-width: 16rem">Type</th> -->
                    <th pSortableColumn="name" style="min-width:16rem">
                        Date et heure
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Description
                        <p-sortIcon field="category" />
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Progression
                        <p-sortIcon field="rating" />
                    </th>
                    <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                        État
                        <p-sortIcon field="inventoryStatus" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>

            <!-- Contenu table -->
            <ng-template #body let-reparation>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="reparation" />
                    </td>
                    <!-- <td style="min-width: 12rem">{{ reparation.code }}</td> -->
                    <td style="min-width: 16rem">{{ reparation.dateDebut }}</td>
                    <!-- <td>{{ reparation.price | currency: 'USD' }}</td> -->
                    <td>{{ reparation.descriptionProbleme }}</td>
                    <td>
                        <p-progressBar [value]="0 * 20"></p-progressBar>
                    </td>
                    <td>
                        <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat))" />
                    </td>
                    <td>
                        <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="detailIntervention(reparation,reparation._id)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Insertion intervention -->
         <p-dialog [(visible)]="newInterventionDialog" [style]="{ width: '450px' }" header="Nouveau intervention" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="inventoryStatus" class="block font-bold mb-3">Vehicule</label>
                        <p-select [options]="vehiListe" [(ngModel)]="newRep.vehiculeId" optionLabel="label" optionValue="value" placeholder="Select vehicule" fluid />
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                        <textarea id="description" pTextarea [(ngModel)]="newRep.descriptionProbleme" required rows="3" cols="20" fluid></textarea>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Date d'intervention</label>
                        <input type="datetime-local" pInputText id="name" [(ngModel)]="newRep.dateDebut" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted">La date est requis.</small>
                    </div>
                    <!-- <div>
                        <span class="block font-bold mb-4">Mécanicien</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="product.category" />
                                <label for="category1">Rakoto</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="product.category" />
                                <label for="category2">Rabe</label>
                            </div>
                        </div>
                    </div> -->
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Enregistrer" icon="pi pi-check" (click)="saveIntervention()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="interventionDialog" [style]="{ width: '450px' }" header="Intervention" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="description" class="block font-bold mb-3"><p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat || ''))" /></label>
                    </div>
                    <div>
                    <label for="description" class="block font-bold mb-3">Vehicule</label>
                        Mazda - BT50
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                            <ul>Probleme : Problème de caméra de recul</ul>
                            <ul>Diagnostique : Verifier le camera de recul, ou changer s'il le faut</ul>
              
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Détails</label>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Devis</label>
                        Total :{{ total}} €
                    </div>
                </div>
            </ng-template>

            <ng-template #footer> 
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Accepter" icon="pi pi-check" (click)="acceptDevis()" />
            </ng-template>
        </p-dialog> 

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ReparationClService, ConfirmationService]
})
export class Intervention implements OnInit {
    newInterventionDialog: boolean = false;
    interventionDialog: boolean = false;

    newRep = {
        vehiculeId: '',
        mecanicienId: '',
        descriptionProbleme: '',
        etat: 'en attente',
        dateDebut: '',
        dateFin: '',
        notesTechniques: '',
        coutFinal: ''
    }

    reparations: ReparationCl[] = []

    total: any = {}

    details: any = {}

    reparation!: ReparationCl

    selectedReparation!: ReparationCl[] | null;

    submitted: boolean = false;

    vehiListe!: any[];

    @ViewChild('dt') dt!: Table;

    // exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private reparationService: ReparationClService,
        private devisService: DevisService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService

    ) { }

    ngOnInit() {
        this.loadReparations()

        this.vehiListe = [
            { label: 'Mazda - BT50', value: '67d0002e360d5465cfade482' },
            { label: 'Audi - RS6', value: '67d009fa8e4dcccf0023d4e6' }
        ];
    }

    loadReparations() {
        this.reparationService.getReparations().subscribe((data) => {
            this.reparations = data;
            console.log('Données de réparation:', this.reparations);
        });
    }

    // loadDevis(id:string){
    //     this.devisService.getDevis(id).subscribe((data) => {
    //         this.devis = data
    //         console.log(this.devis)
    //     })
    // }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.reparation = {};
        this.submitted = false;
        this.newInterventionDialog = true;
    }

    detailIntervention(rep: ReparationCl, id: string) {
        console.log("id", id)
        this.devisService.getDevis(id).subscribe((data) => {
            this.details = data.details
            this.total = data.total
            console.log("devis", this.details)
        })
        this.reparation = { ...rep };
        this.interventionDialog = true;
    }

    // Suppression intervention sélectionné
    deleteselectedReparation() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.products.set(this.products().filter((val) => !this.selectedReparation?.includes(val)));
                // this.selectedReparation = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.newInterventionDialog = false;
        this.interventionDialog = false;
        this.submitted = false;
    }

    // findIndexById(id: string): number {
    //     let index = -1;
    //     for (let i = 0; i < this.products().length; i++) {
    //         if (this.products()[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // }

    // createId(): string {
    //     let id = '';
    //     var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (var i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // }


    // loadDemoData() {
    //     this.productService.getProducts().then((data) => {
    //         this.products.set(data);
    //     });

    //     this.statuses = [
    //         { label: 'Réparation', value: 'reparation' },
    //         { label: 'Révision', value: 'revision' },
    //         { label: 'Diagnostic', value: 'diagnostic' }
    //     ];

    //     this.cols = [
    //         { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
    //         { field: 'name', header: 'Name' },
    //         { field: 'price', header: 'Price' },
    //         { field: 'category', header: 'Category' }
    //     ];

    //     this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    // }

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
            case 'Prêt':
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

    saveIntervention() { 
        this.reparationService.setVehicule(this.newRep).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Intervention Added',
                    life: 3000
                });
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'erreur',
                    detail: '',
                    life: 3000
                });
            }
        )
        console.log("newRep",this.newRep)
        this.loadReparations()
        this.newInterventionDialog = false;
    }

    acceptDevis() { }
}
