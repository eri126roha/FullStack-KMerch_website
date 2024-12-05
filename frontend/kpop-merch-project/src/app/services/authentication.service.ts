import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders   } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenKey = 'auth-token';
  constructor (private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post('http://localhost:3001/api/users/register', userData, {
      headers: {
        'Content-Type': 'application/json'  // Ajoutez ce header si l'API attend du JSON
      }
    });
 
  }
  loginUser(email: string, password: string): Observable<any> {
    const url = 'http://localhost:3001/api/users/login';
    const body = { email: email, password: password };

    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError('Login failed. Please try again.'); // Vous pouvez personnaliser ce message d'erreur
      })
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`http://localhost:3001/api/users/all`);
  }
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3001/api/users/${id}`);
  }
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3001/api/users/${id}`, userData);
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3001/api/users/${id}`);
  }

    // Helper method to retrieve headers with token for secure requests
    private getAuthHeaders(): HttpHeaders {
      const token = this.cookieService.get('token');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  
    // Method to validate if token is present and valid
    isTokenValid(token: string): boolean {

      // Placeholder validation logic (e.g., expiration check)
      return !!token;
      
    }
  
    // Centralized error handling
    private handleError(error: any): Observable<never> {
      console.error('API error occurred:', error);
      return throwError('An error occurred; please try again.');
    }
    getUserRole(): string {
      return this.cookieService.get('role'); // Lire le rôle depuis un cookie
    }
  
    isAdmin(): boolean {
      return this.getUserRole() === 'admin';
    }
    setToken(token: string): void {
      this.cookieService.set(this.tokenKey, token, { path: '/', secure: true, sameSite: 'Strict' });
    }
    getCurrentUser(): User | null {
      //if (typeof window !== 'undefined' && window.localStorage) {
      //  return JSON.parse(localStorage.getItem('currentUser') || '{}');
      //}
      //return null;
      if (isPlatformBrowser(this.platformId)) {
        if (typeof window !== 'undefined' && window.localStorage) {
          return JSON.parse(localStorage.getItem('currentUser') || '{}');
        }
      }
      return null;
    }
   
    getCurrentUserId(): string | null {
      return this.getLoggedInUserId();  // Use the method you already have
    }
    
    logout(): void {
      this.cookieService.delete(this.tokenKey, '/'); // Supprime le cookie
      this.router.navigate(['/login']); // Redirige vers la page de connexion
    }
    private getCookie(name: string): string | null {
      if (isPlatformBrowser(this.platformId)) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    }
      return null;
    }
    getLoggedInUserId(): string | null {
      const token = this.getCookie('token'); // Token stocké dans les cookies sous le nom 'token'
      if (!token) return null;
  
      try {
        // Décoder le token JWT
        const payload = JSON.parse(atob(token.split('.')[1])); // Exemple de décodage de JWT
        return payload.id || null; // Récupérer l'ID de l'utilisateur depuis le payload
      } catch (error) {
        console.error('Erreur lors du décodage du token', error);
        return null;
      }
    }

    // Update user profile method
  updateUserProfile(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3001/api/users/${id}`, userData, {
      headers: this.getAuthHeaders() // Assuming token-based authentication
      }).pipe(catchError(this.handleError)); // Add error handling
  }

    // Delete user account method
  deleteUserAccount(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3001/api/users/${id}`, {
    headers: this.getAuthHeaders() // Assuming token-based authentication
  }).pipe(catchError(this.handleError)); // Add error handling
  }
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.cookieService.get('token');

    return !!token; 
  }

  
}


