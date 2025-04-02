import { Component, NgModule, OnInit, signal, ViewChild } from '@angular/core';
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
import { VehiculeService } from '../../services/vehicule/vehicule.service';
import { AuthService } from '../../services/user/auth.service';
import { PaiementService } from '../../services/paiement/paiement.service';
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
    selector: 'app-intervention',
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
    <p-toast position="top-center"></p-toast>
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
            [paginator]="true"
            [globalFilterFields]="[ 'marque','etat']"
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
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Rechercher marque" />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <!-- <th style="min-width: 16rem">Type</th> -->
                    <th style="min-width:16rem">
                        Date et heure
                       
                        <!-- <p-sortIcon field="date" /> -->
                    </th>
                    <th pSortableColumn="marque" style="min-width:16rem">
                        Voiture
                        <p-sortIcon field="marque" />
                        <!-- <p-sortIcon field="voiture" /> -->
                    </th>
                    <th style="min-width:10rem">
                        Description
                        <!-- <p-sortIcon field="description" /> -->
                    </th>
                    <th  style="min-width: 12rem">
                        Progression
                        <!-- <p-sortIcon field="prog" /> -->
                    </th>
                    <th pSortableColumn="etat" style="min-width: 12rem">
                        État
                        <p-sortIcon field="etat" />
                    </th>

                    <th pSortableColumn="meca" style="min-width: 12rem">
                        Mecanicien
                        <!-- <p-sortIcon field="meca" /> -->
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
                    <td style="min-width: 16rem">{{ reparation.marque }} | {{reparation.modele}}</td>
                    <!-- <td>{{ reparation.price | currency: 'USD' }}</td> -->
                    <td>{{ reparation.descriptionProbleme }}</td>
                    <td>
                        <p-progressBar [value]="reparation.progression"></p-progressBar>
                    </td>
                    <td>
                        <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat))" />
                    </td>

                    <td style="min-width: 16rem">{{ reparation.nom ? reparation.nom : "Not assigned" }}</td>
                    <td>
                        <p-button icon="pi pi-eye" severity="info" class="mr-2" [rounded]="true" [outlined]="true" (click)="detailIntervention(reparation,reparation._id,reparation.marque,reparation.modele)" />
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

        <p-dialog [(visible)]="interventionDialog" [style]="{ width: '450px' }" header="Intervention " [modal]="true">
    <ng-template #content>
        <div class="flex flex-col gap-6">
            <div>
                <label for="description" class="block font-bold mb-3">
                    <p-tag [value]="reparation.etat" [severity]="mapSeverity(getSeverity(reparation.etat || ''))" />
                </label>
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Vehicule</label>
            {{marque}} | {{modele}}
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Description</label>
                <ul>Probleme : {{reparation.descriptionProbleme}}</ul>
                <ul>Diagnostique : {{reparation.notesTechniques}}</ul>
            </div>
            <div>
                <!-- <label for="description" class="block font-bold mb-3">Détails</label> -->
                <p-table
                    [value]="details">
                <ng-template #header>
                <tr>
                    <th>Piece</th>
                    <th>Qté</th>
                    <th style="text-align: right;">PU</th>
                    <th style="text-align: right;">MO</th>
                    <th style="text-align: right;">Total</th>
                </tr>
                </ng-template>
                <ng-template #body let-detail>
                <tr>
                    <td>{{ detail.nomPiece }}</td>
                    <td>{{ detail.quantite }}</td>
                    <td style="text-align: right;">{{ detail.prixUnitaire | formatMontant}} </td>
                    <td style="text-align: right;"> {{ detail.main_d_oeuvre | formatMontant}} </td>
                    <td style="text-align: right;">{{ (detail.quantite * detail.prixUnitaire) + detail.main_d_oeuvre | formatMontant}} </td>
                </tr>
                 {{setRepId(detail.reparationId ? detail.reparationId : "")}}
                </ng-template>
                </p-table>
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Devis</label>
                Total : {{ total | formatMontant}} Ariary
            </div>
        </div>
    </ng-template>

    <ng-template #footer> 
        <p-button label="Refuser" [disabled]="details.length==0 || reparation.etat == 'en cours' || reparation.etat == 'annulé'" icon="pi pi-times" (click)="refuserDevis(repId, updateAnnule)" />
        <p-button label="Payer" [disabled]="details.length==0 || reparation.etat == 'en cours' || reparation.etat == 'annulé'" icon="pi pi-check" (click)="acceptDevis(repId, updateEnCours,total)" />
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

    updateEnCours = {
        etat: 'en cours'
    }

    updateAnnule = {
        etat: 'annulé'
    }


    repId: string = ""

    marque: string = ""

    modele: string = ""

    montant: string = ""

    newPaiement = {
        montant: 0,
        date: '',
        reparationId: '',
        clientId: '',
    }

    reparations: ReparationCl[] = []

    total: any = {}

    details: any = []

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
        private vehiculeService: VehiculeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private paiementService: PaiementService,

    ) { }

    setRepId(id: string) {
        this.repId = id
    }

    setMontant(montant: string) {
        this.montant = montant
    }

    setMarque(id: string) {
        this.marque = id
    }

    setModele(id: string) {
        this.modele = id
    }

    ngOnInit() {
        this.loadReparations()
        this.loadVehicules()
        // this.vehiListe = [
        //     { label: 'Mazda - BT50', value: '67d0002e360d5465cfade482' },
        //     { label: 'Audi - RS6', value: '67d009fa8e4dcccf0023d4e6' }
        // ];
    }

    loadVehicules() {
        // this.vehiculeService.getVehicule().subscribe((data) => {
        //     this.vehiListe = data.map(d => {
        //         "label" : d._id
        //     });
        //     console.log('Données', this.vehiListe);
        // });
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

    detailIntervention(rep: ReparationCl, id: string, mr: string, md: string) {
        console.log("id", id)
        this.devisService.getDevis(id).subscribe((data) => {
            this.details = data.details
            this.total = data.total
            console.log("devis", this.details)
        })
        this.setMarque(mr)
        this.setModele(md)
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
        this.details = []
    }

    saveIntervention() {
        this.reparationService.setReparation(this.newRep).subscribe(
            (response) => {
                this.loadReparations()
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
        this.newRep = {
            vehiculeId: '',
            mecanicienId: '',
            descriptionProbleme: '',
            etat: 'en attente',
            dateDebut: '',
            dateFin: '',
            notesTechniques: '',
            coutFinal: ''
        }
        this.newInterventionDialog = false;
    }

    acceptDevis(id: string, update: any, montant:number) {
        console.log(id, update)
        const token = this.authService.getToken()
        this.newPaiement = {
            montant: montant,
            date: new Date().toISOString(),
            reparationId: id,
            clientId: token.id,
        }

        this.paiementService.setPaiement(this.newPaiement).subscribe(
            (response) => {
                console.log(response)
            },
            (error) => {
            }
        )

        this.reparationService.updateReparation(id, update).subscribe(
            (response) => {
                this.repId = ""
                this.loadReparations()
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réussie',
                    detail: 'Intervention modifié',
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
        this.repId=""
        this.hideDialog()
    }

    refuserDevis(id: string, update: any) {
        console.log(id, update)
        this.reparationService.updateReparation(id, update).subscribe(
            (response) => {
                this.repId = ""
                this.loadReparations()
                this.messageService.add({
                    severity: 'success',
                    summary: 'Réussie',
                    detail: 'Intervention refuser',
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
        this.hideDialog()
    }


    getSeverity(status: string) {
        switch (status) {
            case 'en cours':
                return 'blue';
            case 'terminé':
                return 'green';
            case 'en attente':
                return 'yellow';
            case 'annulé':
                return 'red';
            case 'pret':
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

}
