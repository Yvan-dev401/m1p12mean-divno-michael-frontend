import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DevisService {
    private apiUrl = 'http://localhost:5000/devis';

    constructor(private http: HttpClient) {}

    getDevis(id:string): Observable<any> {
      return this.http.get(`${this.apiUrl}/devisByReparationID?repId=${id}`);
    }
}

// export interface Devis {
//     _id?: string;
//     vehicleId?: string;
//     mecanicienId?: string;
//     descriptionProbleme?: string;
//     etat?: string;
//     dateDebut?: string;
//     dateFin?: string
//     notesTechniques?: string
//     coutFinal?: string
// }
