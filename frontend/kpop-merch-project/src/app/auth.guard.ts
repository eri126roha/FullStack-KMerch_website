import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const token = this.cookieService.get('token');
    if (token && this.authService.isTokenValid(token)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}


