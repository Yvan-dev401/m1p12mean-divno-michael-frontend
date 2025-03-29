import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SortieSevice {
    private apiUrl = 'http://localhost:5000/sortie';

    constructor(private http: HttpClient) {}

    getSortie(): Observable<Sortie[]> {
        return this.http.get<Sortie[]>(this.apiUrl);
    }

    getSortieById(idReparation: string): Observable<Sortie> {
        return this.http.get<Sortie>(`${this.apiUrl}/${idReparation}`);
    }
}

export interface Sortie {
    _id: string;
    nomPiece: string;
    quantiteDisponible: number;
    prixUnitaire: number;
    main_d_oeuvre: number;
}