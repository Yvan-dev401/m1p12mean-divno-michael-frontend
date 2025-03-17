import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000/user';

  private apiLogin = 'http://localhost:5000/user/login'

  constructor(private http: HttpClient) {}

  getUser(): Observable<any>{
    return this.http.get(this.apiUrl)
  }

  inscription(user:any): Observable<any>{
    return this.http.post(this.apiUrl, user);
  }

  login(user:any): Observable<any>{
    return this.http.post(this.apiLogin, user,{ withCredentials: true });
  }

  updateUser(id: string, user:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, user)
  }

  deleteUser(id: string) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
