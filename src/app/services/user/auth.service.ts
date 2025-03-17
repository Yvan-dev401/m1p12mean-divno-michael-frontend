import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private cookieService: CookieService) { }

    getSessionToken(): string | null {
        return this.cookieService.get('SessionID') || null;
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