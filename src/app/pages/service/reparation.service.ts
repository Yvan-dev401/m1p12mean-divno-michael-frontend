import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReparationService {
    private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/reparation';

    constructor(private http: HttpClient) {}

    getReparations(): Observable<Reparation[]> {
        return this.http.get<Reparation[]>(this.apiUrl);
    }

    updateReparation(id: string, reparation: Partial<Reparation>): Observable<Reparation> {
        return this.http.put<Reparation>(`${this.apiUrl}/${id}`, reparation);
    }

    getTodayReparations(): Observable<Reparation[]> {
        return this.http.get<Reparation[]>(`${this.apiUrl}/today`);
    }
}

export interface Reparation {
    _id: string;
    vehicleId: string;
    mecanicienId: string;
    descriptionProbleme: string;
    etat: string;
    dateDebut: string;
}
