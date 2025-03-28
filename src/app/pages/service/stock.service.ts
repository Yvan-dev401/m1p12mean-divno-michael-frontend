import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private apiUrl = 'http://localhost:5000/stock';

    constructor(private http: HttpClient) {}

    getStock(): Observable<Stock[]> {
        return this.http.get<Stock[]>(this.apiUrl);
    }

    insertStock(stock: Partial<Stock>): Observable<Stock> {
        return this.http.post<Stock>(this.apiUrl, stock);
    }
}

export interface Stock {
    _id: string;
    nomPiece: string;
    quantiteDisponible: number;
    prixUnitaire: number;
    main_d_oeuvre: number;
}