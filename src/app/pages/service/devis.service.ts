import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { json } from 'express';

@Injectable({
    providedIn: 'root'
})
export class DevisServices {
    private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/devis';
    private count = 0

    constructor(private http: HttpClient) {}

    insert(itemsToSave: { stockId: string; quantite: number; reparationId: string; etat: boolean }[]):  Observable<any>  {
        return this.http.post<any>(this.apiUrl, { items: itemsToSave });
    }

    getDevis(): Observable<Devis[]> {
        return this.http.get<Devis[]>(this.apiUrl);
    }

    updateDevis(id: string, updateData: Partial<Devis>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, updateData);
    }

    checkQuantity(itemsToSave: { stockId: string; quantite: number; reparationId: string; etat: boolean }[]):number{
        this.count = 0
        for(let i=0;i<itemsToSave.length;i++){
            if(itemsToSave[i].quantite == 0){
                this.count +=1 
            }
        }
        return this.count;
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