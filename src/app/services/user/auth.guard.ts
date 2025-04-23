import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';// Supposons que vous avez un service pour gérer l'authentification

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route : ActivatedRouteSnapshot): boolean {
    const token = true
    console.log("token",localStorage.getItem('auth_token'));
    // const token = this.authService.getToken();
    // console.log("mlkfjmsdlj")
    if( token ){
      return false
      // const role = token.role;
      // const requiredRole = route.data['role']
      // console.log("cookie",token.id)

      // if(role == requiredRole){
      //   return true;
      // }
      // else{
      //   this.router.navigate(['/auth/access'])
      //   return false;
      // }
    }
    else{
      // this.router.navigate(['/auth/login'])
      //this.router.navigate(['/']);
      return false
    }
  }
}