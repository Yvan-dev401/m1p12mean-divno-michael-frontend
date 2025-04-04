import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {
    private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/paiement';

    constructor(private http: HttpClient) {}

    getStatistique(): Observable<any> {
      return this.http.get(`${this.apiUrl}/stat`);
  }

    getPaiement(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    setPaiement(rep:any): Observable<any>{
      return this.http.post(this.apiUrl, rep);
    }
}

export interface Paiement {
    _id?: string;
    reparationId?: string;
    clientId?: string;
    montant?: number;
    date?: string
}
