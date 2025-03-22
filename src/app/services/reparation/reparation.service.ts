import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReparationClService {
    private apiUrl = 'http://localhost:5000/reparation';

    constructor(private http: HttpClient) {}

    getReparations(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    setVehicule(rep:any): Observable<any>{
      return this.http.post(this.apiUrl, rep);
    }
}

export interface ReparationCl {
    _id?: string;
    vehicleId?: string;
    mecanicienId?: string;
    descriptionProbleme?: string;
    etat?: string;
    dateDebut?: string;
    dateFin?: string
    notesTechniques?: string
    coutFinal?: string
}
