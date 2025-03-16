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
        <p-table
            #dt
            [value]="products()"
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
                    <h5 class="m-0">Planning</h5>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Pièces
                        <p-sortIcon field="category" />
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Quantité
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
            <ng-template #body let-product>
                <tr>
                    <td>{{ product.category }}</td>
                    <td>2</td>
                    <td>
                        <p-tag [value]="product.inventoryStatus" [severity]="mapSeverity(getSeverity(product.inventoryStatus))" (click)="op.toggle($event)" />
                        <p-overlayPanel #op>
                            <div class="status-option" (click)="changeStatus(product, 'En attente'); op.hide()">En attente</div>
                            <div class="status-option" (click)="changeStatus(product, 'Livré'); op.hide()">Livré</div>
                        </p-overlayPanel>
                    </td>
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
                    <td>
                        <!-- <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" /> -->
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
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

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadDemoData();
    }

    changeStatus(product: Product, status: string) {
        product.inventoryStatus = status;
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
}
