import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
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
import { CommandeService, Commande } from '../service/commande.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';

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
    selector: 'app-order',
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
        ConfirmDialogModule,
        OverlayPanelModule
    ],
    template: `
    <div class="card">
    <p-toast position="top-center"></p-toast>
        <p-table
            #dt
            [value]="commandes"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Affichage {first} de {last} à {totalRecords} commande"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Planning</h5>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Date et heure
                        <p-sortIcon field="category" />
                    </th>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Pièces
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Quantité
                    </th>
                    <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                        État et Action
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>

            <!-- Contenu table -->
            <ng-template #body let-commande>
                <tr>
                    <td>{{ commande.date | date: 'dd-MM-yyyy HH:mm' }}</td>
                    <td>{{ commande.nomPiece }}</td>
                    <td>{{ commande.orderQuantite }}</td>
                    <td>
                        <p-tag [value]="commande.etat" [severity]="mapSeverity(getSeverity(commande.etat))" (click)="!isDelivered(commande.etat) && op.toggle($event)" />
                        <p-overlayPanel #op *ngIf="!isDelivered(commande.etat)">
                            <!-- Afficher les options de statut uniquement si l'état n'est pas "Livré" -->
                            <div class="status-option" (click)="changeStatus(commande, 'Livré'); op.hide()">Livré</div>
                        </p-overlayPanel>
                    </td>
                    <td>
                        <!-- <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" /> -->
                    </td>
                </tr>
            </ng-template>
        </p-table>
        </div>
        <style>
            .status-option {
                padding: 8px 12px;
                cursor: pointer;
            }

            .status-option:hover {
                background-color: #f0f0f0;
            }

            .status-option + .status-option {
                margin-top: 8px;
            }
        </style>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [DatePipe, MessageService, ProductService, ConfirmationService]
})
export class Order implements OnInit {
    productDialog: boolean = false;
    interventionDialog: boolean = false;

    products = signal<Product[]>([]);
    product!: Product;
    selectedProducts!: Product[] | null;

    submitted: boolean = false;
    statuses!: any[];

    @ViewChild('dt') dt!: Table;
    @ViewChild('op') op!: any; // Add ViewChild for the overlay panel

    exportColumns!: ExportColumn[];

    cols!: Column[];

    // Commande :
    commande!: Commande;
    commandes: Commande[] = [];
    selectedCommande!: Commande[] | null;
    commandeStatuses!: any[];

    constructor(private commandeService: CommandeService, private messageService: MessageService) { }

    ngOnInit() {
        this.loadCommande();
    }

    loadCommande() {
        this.commandeService.getCommande().subscribe((data) => {
            this.commandes = data;
        });
    }

    changeStatus(commande: Commande, status: string) {
        commande.etat = status;
        this.commandeService.changeStatus(commande._id, status).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réussie',
                    detail: 'Vehicule ajouté avec succès',
                    life: 3000
                });
                this.loadCommande();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'erreur',
                    detail: '',
                    life: 3000
                });
            }
        });
    }

    isDelivered(etat: string): boolean {
        return etat === 'Livré';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Livré':
                return 'green';
            case 'En attente':
                return 'yellow';
            default:
                return 'info';
        }
    }

    mapSeverity(severity: string): 'success' | 'info' | 'warn' | undefined {
        switch (severity) {
            case 'green':
                return 'success';
            case 'yellow':
                return 'warn';
            default:
                return 'info';
        }
    }

    /* loadDemoData() {
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
    } */
}
