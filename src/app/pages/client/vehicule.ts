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
import { Vehicule, VehiculeService } from '../../services/vehicule/vehicule.service';
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

@Component({
    selector: 'app-vehicule',
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

<p-toast position="top-center"></p-toast>
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nouvelle véhicule" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Supprimer" icon="pi pi-trash" outlined (onClick)="deleteSelectedVehicule()" [disabled]="!selectedVehicule || !selectedVehicule.length" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="vehicules"
            [rows]="5"
            [columns]="['marque','modele','annee','kilometrage','immatriculation']"
            [paginator]="true"
            [globalFilterFields]="['marque','modele','annee','kilometrage','immatriculation']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedVehicule"
            [rowHover]="true"
            dataKey="_id"
            currentPageReportTemplate="Affichage {first} de {last} à {totalRecords} vehicule"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[5,10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Liste véhicule</h5>
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
                    <th pSortableColumn="marque" style="min-width:10rem">
                        Marque
                        <p-sortIcon field="marque" />
                    </th>
                    <th pSortableColumn="modele" style="min-width: 12rem">
                        Modele
                        <p-sortIcon field="modele" />
                    </th>
                    <th pSortableColumn="annee" style="min-width: 12rem">
                        Annee 
                        <p-sortIcon field="modele" />
                    </th>
                    <th pSortableColumn="kilometrage" style="min-width: 12rem">
                        Kilometrage
                         <p-sortIcon field="kilometrage" />
                    </th>
                    <th pSortableColumn="immatriculation" style="min-width: 12rem">
                        Immatriculation
                         <p-sortIcon field="immatriculation" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>

            <!-- Contenu table -->
            <ng-template #body let-vehicule>
                <tr>
                <td style="width: 3rem">
                        <p-tableCheckbox [value]="vehicule" />
                    </td>
                    <td>{{ vehicule.marque }}</td>
                    <td>{{ vehicule.modele }}</td>
                    <td>{{ vehicule.annee }}</td>
                    <td>{{ vehicule.kilometrage }}</td>
                    <td>
                        <p-tag [value]="vehicule.plaqueImmatriculation" [severity]="'success'" />
                    </td>
                    <td>
                        <!-- <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="detailVehicule(product)" /> -->
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="openUpdate(vehicule)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Insertion intervention -->
        <p-dialog [(visible)]="newVehicule" [style]="{ width: '450px' }" header="Nouvelle voiture" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label class="block font-bold mb-3">Marque</label>
                        <input type="text" pInputText id="name" [(ngModel)]="newVehi.marque" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Modele</label>
                        <input type="text" pInputText id="modele" [(ngModel)]="newVehi.modele" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Annee de sortie</label>
                        <input type="text" pInputText id="annee" [(ngModel)]="newVehi.annee" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Kilometrage</label>
                        <input type="text" pInputText id="kilometrage" [(ngModel)]="newVehi.kilometrage" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Plaque d'immatriculation</label>
                        <input type="text" pInputText id="plaqueImmatriculation" [(ngModel)]="newVehi.plaqueImmatriculation" fluid />
                    </div>
                    <!-- <div>
                        <label for="description" class="block font-bold mb-3">Description de la voiture</label>
                        <textarea id="description" pTextarea [(ngModel)]="vehicule.description" required rows="3" cols="20" fluid></textarea>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Kilométrage</label>
                        <input type="number" pInputText id="name" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !product.name">Le kilométrage est requis.</small>
                    </div> -->
                </div>
            </ng-template>
            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Enregistrer" icon="pi pi-check" (click)="saveVehicule()" />
            </ng-template>
        </p-dialog>

            <p-dialog [(visible)]="updateVehiculeD" [style]="{ width: '450px' }" header="Modifier voiture" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                <div>
                        <label class="block font-bold mb-3">Marque</label>
                        <input type="text" pInputText id="name" [(ngModel)]="updateVehi.marque" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Modele</label>
                        <input type="text" pInputText id="modele" [(ngModel)]="updateVehi.modele" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Annee de sortie</label>
                        <input type="text" pInputText id="annee" [(ngModel)]="updateVehi.annee" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Kilometrage</label>
                        <input type="text" pInputText id="kilometrage" [(ngModel)]="updateVehi.kilometrage" fluid />
                    </div>
                    <div>
                        <label class="block font-bold mb-3">Plaque d'immatriculation</label>
                        <input type="text" pInputText id="plaqueImmatriculation" [(ngModel)]="updateVehi.plaqueImmatriculation" fluid />
                    </div>
                </div>
            </ng-template>


            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Modifier" icon="pi pi-check" (click)="updateVehicule()" />
            </ng-template>
        </p-dialog>

        <!-- <p-dialog [(visible)]="updateVehiculeD" [style]="{ width: '450px' }" header="Intervention [type d'intervention]" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                        Marque et modèle, Année de mise en circulation, Kilométrage actuel
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Détails</label>
                        Marque et modèle, Année de mise en circulation, Kilométrage actuel
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Devis</label>
                        Total : 0.00 €
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Fermer" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Accepter" icon="pi pi-check" (click)="updateVehicule()" />
            </ng-template>
        </p-dialog> -->

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, VehiculeService, ConfirmationService]
})
export class ListeVehicule implements OnInit {
    newVehicule: boolean = false;
    detailDialog: boolean = false;
    updateVehiculeD: boolean = false;

    // products = signal<Product[]>([]);

    _id: string = ''

    updateVehi = {
        marque: '',
        modele: '',
        annee: '',
        kilometrage: '',
        plaqueImmatriculation: ''
    }


    newVehi = {
        id: '',
        marque: '',
        modele: '',
        annee: '',
        kilometrage: '',
        plaqueImmatriculation: ''
    }

    vehicules: Vehicule[] = [];

    vehicule!: Vehicule;

    selectedVehicule!: Vehicule[];

    submitted: boolean = false;

    // statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    // cols!: Column[];

    constructor(
        private vehiculeService: VehiculeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadVehicules()
    }

    saveVehicule() {
        const token = this.authService.getToken()
        this.newVehi = {
            id: token.id,
            marque: this.newVehi.marque,
            modele: this.newVehi.modele,
            annee: this.newVehi.annee,
            kilometrage: this.newVehi.kilometrage,
            plaqueImmatriculation: this.newVehi.plaqueImmatriculation
        }

        // console.log("ito",this.newVehi)
        this.vehiculeService.setVehicule(this.newVehi).subscribe(
            (response) => {
                this.loadVehicules()
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réussie',
                    detail: 'Vehicule ajouté avec succès',
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

        this.newVehi = {
            id: '',
            marque: '',
            modele: '',
            annee: '',
            kilometrage: '',
            plaqueImmatriculation: ''
        }
        this.newVehicule = false;
    }

    loadVehicules() {
        this.vehiculeService.getVehicule().subscribe((data) => {
            this.vehicules = data;
            //console.log('Données de vehicules:', this.vehicules);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        //this.vehicule = {};
        this.newVehicule = true;
    }

    openUpdate(up: any) {
        this._id = up._id
        this.updateVehi = {
            marque: up.marque,
            modele: up.modele,
            annee: up.annee,
            kilometrage: up.kilometrage,
            plaqueImmatriculation: up.plaqueImmatriculation
        }

        console.log(this._id)
        this.updateVehiculeD = true;
    }



    deleteSelectedVehicule() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.vehiculeService.deleteVehicule("" + this.selectedVehicule[0]._id)
                this.selectedVehicule = []
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réussie',
                    detail: 'Vehicule supprimé avec succès',
                    life: 3000
                });
                this.loadVehicules()
            }
        });
    }

    hideDialog() {
        this.newVehicule = false;
        this.detailDialog = false;
        this.updateVehiculeD = false;
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

    updateVehicule() {
        this.vehiculeService.updateVehicule(this._id, this.updateVehi).subscribe(
            (response) => {
                this.loadVehicules()
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réussie',
                    detail: 'Vehicule modifié avec succès',
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

        this.updateVehi = {
            marque: '',
            modele: '',
            annee: '',
            kilometrage: '',
            plaqueImmatriculation: ''
        }
        this.updateVehiculeD = false;
    }
}
