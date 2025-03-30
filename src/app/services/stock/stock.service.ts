import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StockService {

    private apiUrl = 'http://localhost:5000/stock/progression';

    constructor(private http: HttpClient) {}

    getProgression(id:string): Observable<any>{
        return this.http.get(`${this.apiUrl}/${id}`)
    }
}

export interface StockService {
    _id?: string;
    nomPiece?: string;
    quantiteDisponible?: string;
    descriptionProbleme?: string;
    prixUnitaire?: number;
    main_d_oeuvre?: number;
}
