import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const tokenData = this.authService.getToken();
    
    if (!tokenData) {
      this.redirectToLogin();
      console.log('Token not found. Redirecting to login.');
      return false;
    }

    const requiredRole = route.data['role'];
    
    if (tokenData.role === requiredRole) {
      return true;
    }

    this.handleUnauthorized(requiredRole);
    return false;
  }

  private redirectToLogin(): void {
    // Stocker l'URL demandée pour redirection après login
    const currentUrl = this.router.url;
    if (currentUrl !== '/auth/login') {
      localStorage.setItem('redirectUrl', currentUrl);
    }
    this.router.navigate(['/auth/login']);
  }

  private handleUnauthorized(requiredRole: string): void {
    console.warn(`Access denied. Required role: ${requiredRole}`);
    
    // Option 1: Rediriger vers page d'accès refusé
    this.router.navigate(['/auth/access']);
    
    // Option 2: Rediriger vers page par défaut
    // this.router.navigate(['/']);
  }
}