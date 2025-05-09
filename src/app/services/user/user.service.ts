import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://m1p12mean-divno-michael-backend.onrender.com/user';

  constructor(private http: HttpClient) {}

  getUserById(id: string, user:any): Observable<any>{
    return this.http.get(`${this.apiUrl}/${id}`, user)
  }

  getUser(): Observable<any>{
    return this.http.get(this.apiUrl)
  }

  inscription(user:any): Observable<any>{
    return this.http.post(this.apiUrl, user);
  }

  login(user:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, user, { withCredentials: true });
  }

  logout(): Observable<any>{
    return this.http.get(`${this.apiUrl}/logout`);
  }

  updateUser(id: string, user:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, user)
  }

  deleteUser(id: string) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
