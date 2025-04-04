import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/statistique';

  constructor(private http: HttpClient) { }

  getStatistique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  getRecette(annee:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/recette/${annee}`);
  }

  getProductivite(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productivite`);
  }

}

