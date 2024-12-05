import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router ){}// Inject Router here) {}
  
  
  
    isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  isAuthenticated(): boolean {
    //const token = this.cookieService.get('token'); // Get token from cookie
    //return token ? this.authService.isTokenValid(token) : false; // Pass token here
    const token = this.cookieService.get('token'); // Get token from cookie
    const isValid = token ? this.authService.isTokenValid(token) : false; // Pass token here
  return isValid;
  }

  // Get the current user
  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }
  
  // Log out the user
  logout(): void {
    this.cookieService.delete('token');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
