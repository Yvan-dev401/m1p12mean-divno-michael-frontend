import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private apiUrl = 'http://localhost:5000/vehicule';

  constructor(private http: HttpClient) { }

    // getvehiculeById(id: string, user:any): Observable<any>{
    //   return this.http.get(`${this.apiUrl}/${id}`, user)
    // }
  
    getVehicule(): Observable<any>{
      return this.http.get(this.apiUrl)
    }
  
    setVehicule(vehicule:any): Observable<any>{
      return this.http.post(this.apiUrl, vehicule);
    }
  
    updateVehicule(id: string, vehicule:any): Observable<any>{
      return this.http.put(`${this.apiUrl}/${id}`, vehicule)
    }
  
    deleteVehicule(id: string) : Observable<any>{
      return this.http.delete(`${this.apiUrl}/${id}`)
    }


}

export interface Vehicule {
  _id: string;
  clientId: string;
  marque: string;
  modele: string;
  annee: string;
  plaqueImmatriculation: string;
}

