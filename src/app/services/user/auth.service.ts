import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private cookieService: CookieService) { }

    getSessionToken(): string | null {
        return this.cookieService.get('SessionID') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDAwMDJlMzYwZDU0NjVjZmFkZTQ4MiIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NDUyNDA5OTQsImV4cCI6MTc0NTI0MjE5NH0.wyl6uSsrMLn1pZiMA6_bC-zf0YXz6DXoC3nG3JeOh1g";
    }

    decodeToken(token: string): any {
        try {
            return jwtDecode(token); // Décodage du token
        } catch (error) {
            console.error('Erreur lors du décodage du token :', error);
            return null;
        }
    }

    getToken(): any {
        const token = this.getSessionToken();
        console.log("token", token)
        if (token) {
            return this.decodeToken(token);
        }
        return null;
    }

    isTokenExpired(token: string): boolean {
        const token_decode = this.decodeToken(token);
        if (token_decode && token_decode.exp) {
          const expirationDate = new Date(token_decode.exp * 1000);
          return expirationDate < new Date();
        }
        return true;
      }
}