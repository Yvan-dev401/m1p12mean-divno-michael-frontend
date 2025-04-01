import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DevisServices {
    private apiUrl = 'http://localhost:5000/devis';

    constructor(private http: HttpClient) {}

    insert(itemsToSave: { stockId: string; quantite: number; reparationId: string; etat: boolean }[]): Observable<any> {
        return this.http.post<any>(this.apiUrl, { items: itemsToSave });
    }

    getDevis(): Observable<Devis[]> {
        return this.http.get<Devis[]>(this.apiUrl);
    }

    updateDevis(id: string, updateData: Partial<Devis>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, updateData);
    }
}

export interface Devis {
    _id: string;
    reparationId: string;
    // items: { stockId: string; quantite: number; etat: boolean }[];
    stockId: string;
    nomPiece: string;
    quantite: number;
    etat: boolean;
}