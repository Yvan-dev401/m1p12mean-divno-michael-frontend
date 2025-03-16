import { Component, inject, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { NodeService } from '../service/node.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule, FormsModule, TreeModule, TreeTableModule, DatePickerModule, FluidModule, ButtonModule],
    // imports: [CommonModule, FormsModule, TreeModule, TreeTableModule, DatePickerModule, FluidModule],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Calendrier</div>

            <div class="flex-auto mb-5">
                <label for="icondisplay" class="font-bold block mb-2"> Filtrer </label>
                <div style="display: flex; align-items: center;">
                    <p-datepicker [(ngModel)]="date2" [iconDisplay]="'input'" [showIcon]="true" inputId="icondisplay" />
                    <button pButton type="button" label="Filtrer" class="ml-2" (click)="filterByDate()"></button>
                </div>
            </div>

            <p-treetable [value]="treeTableValue" [columns]="cols" selectionMode="checkbox" [(selectionKeys)]="selectedTreeTableValue" dataKey="key" [scrollable]="true" [tableStyle]="{ 'min-width': '50rem' }">
                <ng-template #header let-columns>
                    <tr>
                        <th *ngFor="let col of columns">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns">
                    <tr [ttRow]="rowNode" [ttSelectableRow]="rowNode">
                        <td *ngFor="let col of columns; let i = index">
                            <p-treeTableToggler [rowNode]="rowNode" *ngIf="i === 0" />
                            <!-- <p-treeTableCheckbox [value]="rowNode" *ngIf="i === 0" /> -->
                            <span [style.color]="getColor(rowData[col.field])">
                                {{ rowData[col.field] }}
                            </span>
                        </td>
                    </tr>
                </ng-template>
            </p-treetable>
        </div>
    `,
    providers: [NodeService]
})
export class Calendar implements OnInit {
    treeValue: TreeNode[] = [];

    treeTableValue: TreeNode[] = [];

    selectedTreeValue: TreeNode[] = [];

    selectedTreeTableValue = {};

    cols: any[] = [];

    date2: Date | undefined;

    nodeService = inject(NodeService);

    ngOnInit() {
        this.nodeService.getFiles().then((files) => (this.treeValue = files));
        this.nodeService.getTreeTableNodes().then((files: any) => (this.treeTableValue = files));

        this.cols = [
            { field: 'heure', header: 'Heure' },
            // { field: 'size', header: 'Size' },
            { field: 'disponibilite', header: 'Disponibilité' }
        ];

        this.selectedTreeTableValue = {
            '0-0': {
                partialChecked: false,
                checked: true
            }
        };
    }

    getColor(disponibilite: string): string {
        switch (disponibilite) {
            case 'Pris':
                return 'red';
            case 'Disponible':
                return 'green';
            default:
                return 'black';
        }
    }

    filterByDate() {
        // Logique de filtrage par date
    }
}
