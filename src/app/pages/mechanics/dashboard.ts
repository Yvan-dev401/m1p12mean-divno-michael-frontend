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
import { CheckboxModule } from 'primeng/checkbox';
import { Product, ProductService } from '../service/product.service';
import { CountryService } from '../service/country.service';
import { ReparationService, Reparation } from '../service/reparation.service';
import { AutoComplete } from 'primeng/autocomplete';
import { HttpClientModule } from '@angular/common/http';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-dashboard',
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
        AutoComplete,
        CheckboxModule,
        AutoComplete,
        HttpClientModule
    ],
    template: `
        <p-table
            #dt
            [value]="reparations"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Affichage {first} de {last} à {totalRecords} intervention"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Liste des interventions en cours</h5>
                    <!-- <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Rechercher..." />
                    </p-iconfield> -->
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <!-- <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th> -->
                    <!-- <th style="min-width: 16rem">Type</th> -->
                    <th pSortableColumn="name" style="min-width:16rem">
                        Date et heure
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Mécanicien
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Type
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
                    <!-- <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td> -->
                    <td style="min-width: 16rem">{{ reparation.dateDebut }}</td>
                    <!-- <td>{{ product.price | currency: 'USD' }}</td> -->
                    <td>{{ reparation.mecanicienId }}</td>
                    <td>{{ reparation.etat }}</td>
                    <td>
                        <p-progressBar [value]="20"></p-progressBar>
                    </td>
                    <td>
                        <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat))" />
                    </td>
                    <td>
                        <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="interventionOpen(reparation)" />
                        <p-button icon="pi pi-cog" severity="help" class="mr-2" [rounded]="true" [outlined]="true" (click)="listPiece(reparation)" />
                        <p-button icon="pi pi-check" class="mr-2" [rounded]="true" [outlined]="true" (click)="taskProduct(reparation)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="interventionDialog" [style]="{ width: '450px' }" header="Intervention [type d'intervention]" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="description" class="block font-bold mb-3"><p-tag [value]="product.inventoryStatus" [severity]="mapSeverity(getSeverity(product.inventoryStatus || ''))" /></label>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                        Marque et modèle, Année de mise en circulation, Kilométrage actuel
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Accepter" icon="pi pi-check" (click)="hideDialog()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="pieceDialog" [style]="{ width: '500px', height: '500px' }" header="Intervention [type d'intervention]" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="description" class="block font-bold mb-3"><p-tag [value]="product.inventoryStatus" [severity]="mapSeverity(getSeverity(product.inventoryStatus || ''))" /></label>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Date fin d'intervention</label>
                        <input type="datetime-local" pInputText id="name" [(ngModel)]="product.name" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !product.name">La date est requis.</small>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Pièces nécessaires</label>
                        <!-- <p-autocomplete [(ngModel)]="selectedCountry" [suggestions]="filteredCountries" (completeMethod)="filterCountry($event)" optionLabel="name" /> -->
                    </div>
                    <div *ngFor="let item of items; let i = index">
                        <div style="display: flex; align-items: center;">
                            <p-autocomplete [(ngModel)]="item.selectedCountry" [suggestions]="filteredCountries" (completeMethod)="filterCountry($event)" optionLabel="name" placeholder="Pièces" class="custom-autocomplete"></p-autocomplete>
                            <span style="margin: 0 40px;">x</span>
                            <input type="number" pInputText [(ngModel)]="item.quantity" placeholder="Quantité" style="width: 100px;" />
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button icon="pi pi-plus" [rounded]="true" [text]="true" [raised]="true" severity="success" [style]="{ display: 'block', margin: '0 auto' }" (click)="duplicateItem()" />
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Accepter" icon="pi pi-check" (click)="saveTask()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="taskDialog" [style]="{ width: '500px' }" header="Intervention [type d'intervention]" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="description" class="block font-bold mb-3"><p-tag [value]="product.inventoryStatus" [severity]="mapSeverity(getSeverity(product.inventoryStatus || ''))" /></label>
                    </div>
                    <div>
                        <label style="margin-bottom: 20px" for="description" class="block font-bold mb-3">Liste des tâches</label>
                        <div *ngFor="let task of tasks; let i = index" style="display: flex; align-items: center; margin-bottom: 10px;">
                            <!-- <input type="checkbox" [(ngModel)]="task.completed" style="margin-right: 10px;" /> -->
                            <p-checkbox [style]="{ marginRight: '10px' }" inputId="size_normal" name="size" value="Normal" />
                            <span>{{ task.name }}</span>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Accepter" icon="pi pi-check" (click)="hideDialog()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService, CountryService],
    styles: [
        `
            ::ng-deep .custom-autocomplete .p-autocomplete-input {
                width: 100% !important; /* Étendre la largeur de l'input */
                padding: 5px !important; /* Ajuster l'espace interne */
            }

            ::ng-deep .custom-autocomplete .p-autocomplete {
                width: 250px !important; /* S'assurer que le composant prend toute la largeur */
            }
        `
    ]
})
export class Dashboard implements OnInit {
    // Dialog
    interventionDialog: boolean = false;
    taskDialog: boolean = false;
    pieceDialog: boolean = false;

    // Service
    countries: any[] | undefined;
    selectedCountry: any;
    product!: Product;

    // Variables
    reparations: Reparation[] = [];
    reparation!: Reparation;

    quantity: number = 0;
    tasks: { name: string; completed: boolean }[] = [];
    items: { selectedCountry: any; quantity: number }[] = [];
    filteredCountries: any[] = [];
    products = signal<Product[]>([]);
    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private countryService: CountryService,
        private reparationService: ReparationService
    ) {}

    ngOnInit() {
        this.loadDemoData();
        this.countryService.getCountries().then((countries) => {
            this.countries = countries;
        });
        this.items.push({ selectedCountry: null, quantity: 0 });
        this.loadTasks();
        this.loadReparations();
    }

    loadReparations() {
        this.reparationService.getReparations().subscribe((data) => {
            this.reparations = data;
            console.log('Données de réparation:', this.reparations);
        });
    }

    loadTasks() {
        this.tasks = [
            { name: 'Vérification des freins', completed: false },
            { name: "Changement d'huile", completed: false },
            { name: 'Inspection des pneus', completed: false },
            { name: 'Test de batterie', completed: false }
        ];
    }

    duplicateItem() {
        const newItem = { selectedCountry: null, quantity: 0 };
        this.items.push(newItem);
    }

    filterCountry(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.countries as any[]).length; i++) {
            let country = (this.countries as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }

    loadDemoData() {
        this.productService.getProducts().then((data) => {
            this.products.set(data);
        });

        this.statuses = [
            { label: 'Réparation', value: 'reparation' },
            { label: 'Révision', value: 'revision' },
            { label: 'Diagnostic', value: 'diagnostic' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    interventionOpen(product: Product) {
        this.product = { ...product };
        this.interventionDialog = true;
    }

    listPiece(product: Product) {
        this.product = { ...product };
        this.pieceDialog = true;
    }

    taskProduct(product: Product) {
        this.product = { ...product };
        this.taskDialog = true;
    }

    hideDialog() {
        this.interventionDialog = false;
        this.taskDialog = false;
        this.pieceDialog = false;
        this.submitted = false;
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

    saveTask() {}

    /* onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    } */

    /* openNew() {
        this.product = {};
        this.submitted = false;
    } */

    /* createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    } */

    /* findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    } */
}
