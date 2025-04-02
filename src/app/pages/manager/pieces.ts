import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../service/product.service';
import { StockService, Stock } from '../service/stock.service';
import { CommandeService } from '../service/commande.service';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-pieces',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, DialogModule, ToolbarModule, IconFieldModule, InputIconModule],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nouveau pièce" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="newPiece()" />
            </ng-template>
            <ng-template #center>
                <div class="flex items-center justify-between">
                    <div class="p-inputgroup">
                        <input pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Rechercher..." class="no-border" />
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-search"></i>
                        </span>
                    </div>
                </div>
            </ng-template>
        </p-toolbar>

        <div class="flex flex-col">
            <div class="card">
                <div class="font-semibold text-xl">Inventaire</div>
                <p-dataview [value]="products" [layout]="layout">
                    <ng-template #header>
                        <div class="flex justify-end">
                            <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false">
                                <ng-template #item let-option>
                                    <i class="pi " [ngClass]="{ 'pi-bars': option === 'list', 'pi-table': option === 'grid' }"></i>
                                </ng-template>
                            </p-select-button>
                        </div>
                    </ng-template>

                    <!-- Vue liste -->
                    <ng-template #list let-items>
                        <div class="flex flex-col">
                            <div *ngFor="let stock of stocks; let i = index">
                                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
                                    <!-- <div class="md:w-40 relative">
                                        <img class="block xl:block mx-auto rounded w-full" src="https://primefaces.org/cdn/primevue/images/product/{{ item.image }}" [alt]="item.name" />
                                        <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }">
                                            <p-tag [value]="item.inventoryStatus" [severity]="getSeverity(item)"></p-tag>
                                        </div>
                                    </div> -->
                                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                        <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ stock.nomPiece }}</span>
                                                <div class="text-lg font-medium mt-2">Quantité : {{ stock.quantiteDisponible }}</div>
                                            </div>
                                            <!-- <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                                <div
                                                    class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                    style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                                >
                                                    <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                                </div>
                                            </div> -->
                                        </div>
                                        <div class="flex flex-col md:items-end gap-8">
                                            <span class="text-xl font-semibold">Ar {{ stock.prixUnitaire }}</span>
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <!-- <p-button icon="pi pi-heart" styleClass="h-full" [outlined]="true"></p-button> -->
                                                <p-button icon="pi pi-shopping-cart" label="Commander" (click)="orderOpen(stock)" styleClass="flex-auto md:flex-initial whitespace-nowrap"></p-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>

                    <!-- Vue gallerie -->
                    <ng-template #grid let-items>
                        <div class="grid grid-cols-12 gap-4">
                            <div *ngFor="let stock of stocks; let i = index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                    <!-- <div class="bg-surface-50 flex justify-center rounded p-6">
                                        <div class="relative mx-auto">
                                            <img class="rounded w-full" src="https://primefaces.org/cdn/primevue/images/product/{{ item.image }}" [alt]="item.name" style="max-width: 300px" />
                                            <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }">
                                                <p-tag [value]="item.inventoryStatus" [severity]="getSeverity(item)"></p-tag>
                                            </div>
                                        </div>
                                    </div> -->
                                    <div class="pt-12">
                                        <div class="flex flex-row justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ stock.nomPiece }}</span>
                                                <div class="text-lg font-medium mt-1">Quantité : {{ stock.quantiteDisponible }}</div>
                                            </div>
                                            <!-- <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                                <div
                                                    class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                    style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                                >
                                                    <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                                </div>
                                            </div> -->
                                        </div>
                                        <div class="flex flex-col gap-6 mt-6">
                                            <span class="text-2xl font-semibold">Ar {{ stock.prixUnitaire }}</span>
                                            <div class="flex gap-2">
                                                <p-button icon="pi pi-shopping-cart" label="Commander" (click)="orderOpen(stock)" styleClass="flex-auto md:flex-initial whitespace-nowrap"></p-button>
                                                <!-- <p-button icon="pi pi-shopping-cart" label="Commander" (click)="order()" [disabled]="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap" styleClass="w-full"></p-button> -->
                                                <!-- <p-button icon="pi pi-heart" styleClass="h-full" [outlined]="true"></p-button> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-dataview>
            </div>
        </div>

        <p-dialog [(visible)]="newPieceDialog" [style]="{ width: '450px' }" header="Insertion nouveau pièce" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <!-- <div>
                        <label for="description" class="block font-bold mb-3"><p-tag [value]="product.inventoryStatus" [severity]="mapSeverity(getSeverity(product.inventoryStatus || ''))" /></label>
                    </div> -->
                    <div>
                        <label for="description" class="block font-bold mb-3">Nom pièce</label>
                        <input type="text" id="description" class="block w-full p-2 border rounded" [(ngModel)]="namePiece" placeholder="Ex: Bougie" />
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Quantité</label>
                        <input type="number" id="description" class="block w-full p-2 border rounded" [(ngModel)]="quantity" placeholder="Entrez un nombre" />
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Prix</label>
                        <input type="number" id="description" class="block w-full p-2 border rounded" [(ngModel)]="price" placeholder="5000 Ar" />
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Main d'oeuvre</label>
                        <input type="number" id="description" class="block w-full p-2 border rounded" [(ngModel)]="main_d_oeuvre" placeholder="5000 Ar" />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Insérer" icon="pi pi-check" (click)="save()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="orderDialog" [style]="{ width: '450px' }" header="Commande de pièce" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="description" class="block font-bold mb-3">Pièce</label>
                        <span>{{ selectedStock?.nomPiece }}</span>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Quantité</label>
                        <input type="number" id="description" class="block w-full p-2 border rounded" [(ngModel)]="orderQuantity" placeholder="Entrez un nombre" />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button icon="pi pi-shopping-cart" label="Commander" (click)="selectedStock && order(selectedStock._id)" styleClass="flex-auto md:flex-initial whitespace-nowrap"></p-button>
            </ng-template>
        </p-dialog>
    `,
    styles: `
        ::ng-deep {
            .p-orderlist-list-container {
                width: 100%;
            }
        }
        .no-border {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
        }
    `,
    providers: [ProductService, StockService]
})
export class Pieces {
    layout: 'list' | 'grid' = 'list';
    orderDialog: boolean = false;
    newPieceDialog: boolean = false;

    options = ['list', 'grid'];

    products: Product[] = [];
    stocks: Stock[] = [];

    namePiece: string = '';
    quantity: number = 0;
    price: number = 0;
    main_d_oeuvre: number = 0;
    orderQuantity: number = 0;

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];

    selectedStock: Stock | null = null;

    originalStocks: Stock[] = [];

    constructor(
        private productService: ProductService,
        private stockService: StockService,
        private commandeService: CommandeService
    ) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data.slice(0, 6)));
        this.listStocks();

        /* this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }
        ];

        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }
        ]; */
    }

    listStocks() {
        this.stockService.getStock().subscribe((data) => {
            this.stocks = data;
            this.originalStocks = [...data]; // Sauvegarde des données originales
        });
    }

    onGlobalFilter(event: Event) {
        const query = (event.target as HTMLInputElement).value.toLowerCase();
        if (query) {
            this.stocks = this.originalStocks.filter((stock) => stock.nomPiece.toLowerCase().startsWith(query));
        } else {
            this.stocks = [...this.originalStocks]; // Restauration des données originales
        }
    }

    newPiece() {
        this.newPieceDialog = true;
    }

    orderOpen(stock: Stock) {
        this.selectedStock = stock;
        this.orderDialog = true;
    }

    save() {
        this.stockService
            .insertStock({
                nomPiece: this.namePiece,
                quantiteDisponible: this.quantity,
                prixUnitaire: this.price,
                main_d_oeuvre: this.main_d_oeuvre
            })
            .subscribe(() => {
                this.listStocks();
                this.newPieceDialog = false;
            });
    }

    order(idStock: string) {
        this.commandeService
            .insertCommande({
                idStock: idStock,
                orderQuantite: this.orderQuantity,
                nomPiece: this.selectedStock?.nomPiece || ''
            })
            .subscribe(() => {
                this.orderDialog = false;
                this.listStocks();
                console.log('Commande passée avec succès');
            });
    }

    hideDialog() {
        this.orderDialog = false;
        this.newPieceDialog = false;
        this.selectedStock = null;
    }

    getSeverity(product: Product) {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'info';
        }
    }
}
