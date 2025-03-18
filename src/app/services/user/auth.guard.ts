import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';// Supposons que vous avez un service pour gérer l'authentification

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // L'utilisateur a un token, il peut accéder à la route
    } else {
      this.router.navigate(['/']); // Redirige vers la page de login
      return false; // Bloque l'accès à la route
    }
  }
}