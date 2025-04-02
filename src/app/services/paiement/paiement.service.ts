import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {
    private apiUrl = 'http://localhost:5000/paiement';

    constructor(private http: HttpClient) {}

    getPaiement(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    setPaiement(rep:any): Observable<any>{
      return this.http.post(this.apiUrl, rep);
    }
}

export interface PaiementService {
    _id?: string;
    reparationId?: string;
    clientId?: string;
    montant?: number;
    date?: string
}
