import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiqueService } from '../../../services/stat/statistique.service';
import { TagModule } from 'primeng/tag';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, TagModule],
    template: `
                <div class="col-span-12 lg:col-span-6 xl:col-span-2">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">TOTAL </span>
                         <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{data[0].count + data[1].count + data[2].count+data[3].count+data[4].count}}</div>
                    </div> 
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-2" *ngIf="data.length > 0">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{getCount(0)}}</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <p-tag [value]="getEtat(0)" [severity]="mapSeverity(getSeverity(getEtat(0)))" />
                    </div>
                </div>
                <span class="text-muted-color">Intervention</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-2" *ngIf="data.length > 0">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{getCount(1)}}</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <p-tag [value]="getEtat(1)" [severity]="mapSeverity(getSeverity(getEtat(1)))" />
                    </div>
                </div>
                <span class="text-muted-color">Intervention</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-2" *ngIf="data.length > 0">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{getCount(2)}}</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <p-tag [value]="getEtat(2)" [severity]="mapSeverity(getSeverity(getEtat(2)))" />
                    </div>
                </div>
                <span class="text-muted-color">Intervention</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-2" *ngIf="data.length > 0">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{getCount(3)}}</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <p-tag [value]="getEtat(3)" [severity]="mapSeverity(getSeverity(getEtat(3)))" />
                    </div>
                </div>
                <span class="text-muted-color">Intervention</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-2" *ngIf="data.length > 0">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{getCount(4)}}</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <p-tag [value]="getEtat(4)" [severity]="mapSeverity(getSeverity(getEtat(4)))" />
                    </div>
                </div>
                <span class="text-muted-color">Intervention</span>
            </div>
        </div>

        <!-- Répétez le même pattern pour les autres blocs (1 à 4) -->
        <!-- Remplacez simplement l'index 0 par 1, 2, 3, 4 dans chaque bloc -->
    `
})
export class StatsWidget implements OnInit {
    data: any[] = [];

    constructor(private statistique: StatistiqueService) { }

    ngOnInit(): void {
        this.loadStatistique();
    }

    loadStatistique() {
        this.statistique.getStatistique().subscribe({
            next: (d) => this.data = d || [],
            error: (err) => console.error('Error loading stats:', err)
        });
    }

    // Méthodes de sécurité pour accéder aux données
    getCount(index: number): number {
        return this.data[index]?.count || 0;
    }

    getEtat(index: number): string {
        return this.data[index]?.etat || 'N/A';
    }

    getSeverity(status: string) {
        switch (status?.toLowerCase()) {
            case 'en cours': return 'blue';
            case 'terminé': return 'green';
            case 'en attente': return 'yellow';
            case 'annulé': return 'red';
            case 'pret': return 'orange';
            default: return 'info';
        }
    }

    mapSeverity(severity: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (severity) {
            case 'blue': return 'info';
            case 'green': return 'success';
            case 'yellow': return 'warn';
            case 'red': return 'danger';
            case 'orange': return 'secondary';
            default: return 'info';
        }
    }
}