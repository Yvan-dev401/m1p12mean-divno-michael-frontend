import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ReparationService, Reparation } from '../../service/reparation.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    // imports: [CommonModule, TableModule, ButtonModule, RippleModule, DialogModule],
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, DialogModule],
    template: `<div class="card !mb-8">
        <!-- <div class="font-semibold text-xl mb-4">Recent Sales</div> -->
        <div class="font-semibold text-xl mb-4">Intervention en cours</div>
        <p-table [value]="reparations" [paginator]="true" [rows]="10" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="name">Date</th>
                    <th pSortableColumn="price">Mécanicien</th>
                    <th pSortableColumn="price">Intervention</th>
                    <th>Action</th>
                </tr>
            </ng-template>
            <ng-template #body let-reparation>
                <tr>
                    <td style="width: 35%; min-width: 7rem;">{{ reparation.dateDebut | date: 'dd-MM-yyyy HH:mm' }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ reparation.nom ? reparation.nom : 'Non assigné' }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ reparation.etat }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-eye" class="p-button p-component p-button-text p-button-icon-only" (click)="interventionOpen(reparation)"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
        <p-dialog [(visible)]="interventionDialog" [style]="{ width: '450px' }" header="Intervention" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <!-- <label for="description" class="block font-bold mb-3"><p-tag [value]="product.inventoryStatus" [severity]="mapSeverity(getSeverity(product.inventoryStatus || ''))" /></label> -->
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                        {{ reparation.descriptionProbleme }}
                    </div>
                    <!-- <div>
                        <label for="description" class="block font-bold mb-3">Détails</label>
                        Marque et modèle, Année de mise en circulation, Kilométrage actuel
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Devis</label>
                        Total : 0.00 €
                    </div> -->
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <!-- <p-button label="Accepter" icon="pi pi-check" (click)="hideDialog()" /> -->
            </ng-template>
        </p-dialog>
    </div>`,
    providers: [DatePipe]
})
export class RecentSalesWidget {
    productDialog: boolean = false;
    reparations: Reparation[] = [];
    reparation!: Reparation;

    interventionDialog: boolean = false;
    submitted: boolean = false;

    constructor(private reparationService: ReparationService) {}

    ngOnInit() {
        this.loadReparations();
    }

    loadReparations() {
        this.reparationService.getReparations().subscribe((data) => {
            // Filtrer les réparations avec un état "En cours"
            this.reparations = data.filter((reparation) => reparation.etat === 'en cours');
        });
    }

    interventionOpen(reparation: Reparation) {
        this.reparation = { ...reparation };
        this.interventionDialog = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
}
