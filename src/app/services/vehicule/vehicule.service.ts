import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/vehicule';

  constructor(private http: HttpClient) { }

  // getvehiculeById(id: string, user:any): Observable<any>{
  //   return this.http.get(`${this.apiUrl}/${id}`, user)
  // }

  // vehicule.service.ts
  isVehicleUsed(vehicleId: string): Observable<boolean> {
    return this.http.get<boolean>(`api/vehicles/${vehicleId}/is-used`);
  }

  getVehicule(): Observable<any> {
    return this.http.get(this.apiUrl)
  }

  getVehiculeListe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehi`)
  }

  setVehicule(vehicule: any): Observable<any> {
    return this.http.post(this.apiUrl, vehicule);
  }

  updateVehicule(id: string, vehicule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vehicule)
  }

  deleteVehicule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

}

export interface Vehicule {
  _id?: string;
  clientId?: string;
  marque?: string;
  modele?: string;
  annee?: string;
  plaqueImmatriculation?: string;
  kilometrage?: string
}

