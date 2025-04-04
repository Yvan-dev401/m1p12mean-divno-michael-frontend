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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { FormatMontantPipe } from '../service/formattermontant.services';

@Component({
    selector: 'app-pieces',
    standalone: true,
    imports: [CommonModule, DataViewModule,FormatMontantPipe, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, ToolbarModule],
    template: ` <p-toolbar styleClass="mb-6">
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
                <div class="font-semibold text-xl">Liste pièces</div>

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

                    <ng-template #list let-items>
                        <div class="flex flex-col">
                            <div *ngFor="let stock of stocks; let i = index">
                                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
                                    <div class="md:w-40 relative">
                                    <!-- <img class="block xl:block mx-auto rounded w-full" src="https://primefaces.org/cdn/primevue/images/product/{{ item.image }}" [alt]="item.name" /> -->
                                    <!-- <div class="absolute bg-black/70 rounded-border" [style]="{ width:'5px',left: '2px', top: '2px' }"> -->
                                        <p-tag  [value]="getStatus(stock.quantiteDisponible)" [severity]="mapSeverity(getSeverity(stock.quantiteDisponible))"></p-tag>
                                    <!-- </div> -->
                                </div>
                                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                        <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                            <div>
                                                <span class="text-lg font-medium mt-2">{{ stock.nomPiece }}</span>
                                                <div class="font-medium text-surface-500 dark:text-surface-400 text-sm" >Quantité : {{ stock.quantiteDisponible }}</div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col md:items-end gap-8">
                                            <span class="text-xl font-semibold">Ar {{ stock.prixUnitaire| formatMontant }}</span>
                                            <div class="flex flex-row-reverse md:flex-row gap-2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>

                    <ng-template #grid let-items>
                        <div class="grid grid-cols-12 gap-4">
                            <div *ngFor="let stock of stocks; let i = index" class="col-span-12 sm:col-span-6 lg:col-span-3 p-2">
                                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                    <div class="bg-surface-50 flex justify-center rounded p-6">
                                    <p-tag  [value]="getStatus(stock.quantiteDisponible)" [severity]="mapSeverity(getSeverity(stock.quantiteDisponible))"></p-tag>
                                        <!-- <div class="relative mx-auto">
                                        <img class="rounded w-full" src="https://primefaces.org/cdn/primevue/images/product/{{ item.image }}" [alt]="item.name" style="max-width: 300px" />
                                        <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }">
                                            <p-tag [value]="item.inventoryStatus" [severity]="getSeverity(item)"></p-tag>
                                        </div>
                                    </div> -->
                                    </div>
                                    <div class="pt-12">
                                        <div class="flex flex-row justify-between items-start gap-2">
                                            <div>
                                            <span class="text-lg font-medium mt-2">{{ stock.nomPiece }}</span>
                                            <div class="font-medium text-surface-500 dark:text-surface-400 text-sm" >Quantité : {{ stock.quantiteDisponible }}</div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-6 mt-6">
                                            <span class="text-2xl font-semibold">Ar {{ stock.prixUnitaire | formatMontant}}</span>
                                            <div class="flex gap-2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-dataview>
            </div>
        </div>`,
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

    options = ['list', 'grid'];

    products: Product[] = [];
    stocks: Stock[] = [];

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];

    originalStocks: Stock[] = [];

    constructor(
        private productService: ProductService,
        private stockService: StockService
    ) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data.slice(0, 6)));
        this.listStocks();
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


    getStatus(qt:number){
        if( qt>0 &&qt< 5){
            return "Faible"
        }
        else if(qt>5){
            return "Suffisant"
        }
        else if(qt == 0){
            return "Insuffisant"    
        }
        else{
            return "tsy mety"
        }
    }

    getSeverity(qt:number) {
        if(qt>0 && qt< 5){
            return "orange"
        }
        else if(qt>5){
            return "yellow"
        }
        else if(qt == 0){
            return "red"
        }
        else{
            return "tsy mety"
        }
    }

    mapSeverity(severity: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (severity) {
            case 'blue':
                return 'info';
            case 'green':
                return 'success';
            case 'yellow':
                return 'secondary';
            case 'red':
                return 'danger';
            case 'orange':
                return 'warn';
            default:
                return 'info';
        }
    }
}
