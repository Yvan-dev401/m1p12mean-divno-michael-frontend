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
// import { Product, ProductService } from '../service/product.service';
import { ReparationService, Reparation } from '../service/reparation.service';
import { StockService, Stock } from '../service/stock.service';
import { DevisService, Devis } from '../service/devis.service';
import { SortieSevice, Sortie } from '../service/sortie.service';
import { AutoComplete } from 'primeng/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/user/auth.service';

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
            [(selection)]="selectedReparations"
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
                    <th pSortableColumn="category" style="min-width:10rem">
                        Voiture
                        <p-sortIcon field="category" />
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
                    <th pSortableColumn="name" style="min-width:16rem">
                        Mécanicien
                        <p-sortIcon field="name" />
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
                    <td>{{ reparation.marque }}{{ ' ' }}{{ reparation.modele }}</td>
                    <td>{{ reparation.descriptionProbleme }}</td>
                    <td><p-progressBar [value]="reparation.progression"></p-progressBar></td>
                    <td>
                        <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat))" />
                    </td>
                    <td>
                        {{ reparation.nom ? reparation.nom : 'Non assigné' }}
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
                        <label for="description" class="block font-bold mb-3"><p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat || ''))" /></label>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                        {{ reparation.descriptionProbleme }}
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
                        <label for="description" class="block font-bold mb-3">
                            <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat || ''))" />
                        </label>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Pièces nécessaires</label>
                    </div>
                    <div *ngFor="let item of items; let i = index" class="champTask">
                        <div style="display: flex; align-items: center;">
                            <p-autocomplete
                                [(ngModel)]="item.selectedStock"
                                [suggestions]="filteredStocks"
                                (completeMethod)="filterStock($event)"
                                optionLabel="nomPiece"
                                placeholder="Pièces"
                                class="custom-autocomplete"
                                emptyMessage="Résultat non trouvé"
                            ></p-autocomplete>
                            <span style="margin: 0 25px;">x</span>
                            <input type="number" pInputText [(ngModel)]="item.quantity" placeholder="Quantité" style="width: 100px;" />
                            <p-button *ngIf="items.length > 1" icon="pi pi-trash" [rounded]="true" [text]="true" [raised]="true" severity="danger" (click)="removeItem(i)" [style]="{ marginLeft: '10px' }"></p-button>
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
                        <label for="description" class="block font-bold mb-3">
                            <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat || ''))" />
                        </label>
                    </div>
                    <div>
                        <label style="margin-bottom: 20px" for="description" class="block font-bold mb-3">Liste des tâches</label>
                        <div *ngFor="let task of tasks; let i = index" style="display: flex; flex-direction: column; margin-bottom: 10px;">
                            <div style="display: flex; align-items: center;">
                                <p-checkbox [(ngModel)]="task.completed" [style]="{ marginRight: '10px' }" inputId="task_{{ i }}" binary="true" (onChange)="updateTaskStatus(task)" [disabled]="isQuantityExceedingStock(task)"> </p-checkbox>
                                <span>{{ task.name }} ({{ task.quantite }})</span>
                            </div>
                            <div *ngIf="isQuantityExceedingStock(task)" style="color: red; font-size: 12px; margin-left: 30px;">Quantité demandée dépasse la quantité disponible en stock !</div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Terminer" icon="pi pi-check" (click)="updateInterventionStatus(reparation)" [disabled]="areTasksExceedingStock()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService, StockService, ReparationService, DevisService],
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
    stocks: any[] | undefined;

    selectedReparations: any[] = [];
    selectedStock: any;
    selecedDevis: any;
    selectedSortie: any;

    // Variables
    reparations: Reparation[] = [];
    reparation!: Reparation;

    quantity: number = 0;
    // tasks: { name: string; completed: boolean }[] = [];
    tasks: { _id: string; stockId: string; name: string; completed: boolean; quantite: number }[] = [];
    // items: { selectedCountry: any; quantity: number }[] = [];
    items: { selectedStock: any; quantity: number }[] = [];

    filteredStocks: any[] = [];

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    token!: string;

    constructor(
        private stockService: StockService,
        private reparationService: ReparationService,
        private devisService: DevisService,
        private sortieService: SortieSevice,
        private authService: AuthService
    ) {}

    ngOnInit() {
        // this.loadDemoData();
        // this.token = this.authService.getToken();
        this.stockService.getStock().subscribe((stocks) => {
            this.stocks = stocks;
        });
        // this.items.push({ selectedCountry: null, quantity: 0 });
        this.items.push({ selectedStock: null, quantity: 0 });
        // this.loadTasks();
        this.loadReparations();
    }

    loadReparations() {
        this.reparationService.getReparations().subscribe((data) => {
            this.reparations = data;
        });
    }

    loadTasks() {
        this.devisService.getDevis().subscribe(
            (devis) => {
                const selectedDevis = devis.filter((d) => {
                    const reparationIdDevis = d.reparationId.toString().trim();
                    const reparationIdLocal = this.reparation._id.toString().trim();
                    return reparationIdDevis === reparationIdLocal;
                });

                if (selectedDevis.length > 0) {
                    this.tasks = selectedDevis.map((devis) => ({
                        _id: devis._id,
                        stockId: devis.stockId,
                        name: devis.nomPiece,
                        completed: devis.etat,
                        quantite: devis.quantite
                    }));
                } else {
                    console.log('Aucun devis correspondant trouvé');
                    this.tasks = [];
                }
            },
            (error) => {
                console.error('Erreur lors de la récupération des devis :', error);
            }
        );
    }

    isQuantityExceedingStock(task: { stockId: string; quantite: number }): boolean {
        const stock = this.stocks?.find((s) => s._id === task.stockId);
        return stock ? task.quantite > stock.quantiteDisponible : false;
    }

    areTasksExceedingStock(): boolean {
        return this.tasks.some((task) => this.isQuantityExceedingStock(task));
    }

    updateTaskStatus(task: { _id: string; stockId: string; name: string; completed: boolean; quantite: number }) {
        const _id = task._id;
        const updateData = {
            stockId: task.stockId,
            nomPiece: task.name,
            etat: task.completed,
            reparationId: this.reparation._id,
            quantite: task.quantite
        };

        this.devisService.updateDevis(_id, updateData).subscribe(
            (response) => {
                console.log('Mise à jour réussie :', response);
            },
            (error) => {
                console.error('Erreur lors de la mise à jour :', error);
            }
        );
    }

    duplicateItem() {
        const newItem = { selectedStock: null, quantity: 0 };
        this.items.push(newItem);
    }

    removeItem(index: number) {
        this.items.splice(index, 1);
    }

    filterStock(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.stocks as any[]).length; i++) {
            let stock = (this.stocks as any[])[i];
            if (stock.nomPiece.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(stock);
            }
        }

        this.filteredStocks = filtered;
    }

    interventionOpen(reparation: Reparation) {
        this.reparation = { ...reparation };
        this.interventionDialog = true;
    }

    listPiece(reparation: Reparation) {
        this.reparation = { ...reparation };
        this.pieceDialog = true;
    }

    taskProduct(reparation: Reparation) {
        this.reparation = { ...reparation };
        this.loadTasks(); // Charger les tâches avant d'ouvrir le dialogue
        this.taskDialog = true;
    }

    hideDialog() {
        this.interventionDialog = false;
        this.taskDialog = false;
        this.pieceDialog = false;
        this.submitted = false;
    }

    saveTask() {
        console.log('Items à sauvegarder :', this.items);

        const itemsToSave = this.items.map((item) => ({
            stockId: item.selectedStock._id,
            nomPiece: item.selectedStock.nomPiece,
            quantite: item.quantity,
            reparationId: this.reparation._id, // Ajout de l'ID de la réparation
            etat: false
        }));

        this.devisService.insert(itemsToSave).subscribe(
            (response) => {
                console.log('Réponse :', response);
                // this.hideDialog();

                const token = this.authService.getToken();
                const updateData = {
                    mecanicienId: token.id
                };

                this.reparationService.updateReparation(this.reparation._id, updateData).subscribe(
                    (response) => {
                        console.log('Intervention mise à jour avec succès :', response);
                        this.loadReparations(); // Recharger les interventions après la mise à jour
                    },
                    (error) => {
                        console.log(updateData);
                        console.error("Erreur lors de la mise à jour de l'intervention :", error);
                    }
                );

                window.location.reload();
            },
            (error) => {
                console.error('Erreur :', error);
            }
        );
    }

    updateInterventionStatus(reparation: Reparation) {
        // Appeler getSortieById avec l'ID de la réparation
        this.sortieService.getSortieById(reparation._id).subscribe(
            (sortie) => {
                // console.log('Sortie récupérée avec succès :', sortie);
                this.taskDialog = false; 
                this.loadReparations();
            },
            (error) => {
                console.error('Erreur lors de la récupération de la sortie :', error);
            }
        );
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

    /* loadTasks() {
        this.tasks = [
            { name: 'Vérification des freins', completed: true },
            { name: "Changement d'huile", completed: false },
            { name: 'Inspection des pneus', completed: true },
            { name: 'Test de batterie', completed: false }
        ];
    } */

    /* loadDemoData() {
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
    } */

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
