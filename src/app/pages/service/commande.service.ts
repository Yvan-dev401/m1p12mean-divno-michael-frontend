import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommandeService {
    private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/commande';

    constructor(private http: HttpClient) {}

    getCommande(): Observable<Commande[]> {
        return this.http.get<Commande[]>(this.apiUrl);
    }

    insertCommande(stock: Partial<Commande>): Observable<Commande> {
        return this.http.post<Commande>(this.apiUrl, stock);
    }

    changeStatus(id: string, newStatus: string): Observable<Commande> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Commande>(url, { etat: newStatus });
    }
}

export interface Commande {
    _id: string;
    idStock: string;
    orderQuantite: number;
    date: string;
    nomPiece: string;
    etat: string
}