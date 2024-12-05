import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  

  constructor(private authService: AuthenticationService, private router: Router,private cookieService: CookieService) {}

  login() {
    this.authService.loginUser(this.email, this.password).subscribe(
      (response) => {
        console.log('API Response:', response); // Log la réponse pour l'inspection
  
        const token = response.token; // Assurez-vous que le token est correctement extrait
        const role = response.role; // Vérifiez que vous extrayez le rôle
  
        if (token) {
          // Stockage sécurisé du cookie
          const cookieExpirationDays = 7;
          this.cookieService.set('token', token, cookieExpirationDays, '/', '', true, 'Strict');
         
  
          alert("Bienvenue");
          // Vérifiez le token avant de naviguer
          if (this.authService.isTokenValid(token)) {
            this.router.navigate(['/home']);
          } else {
            alert("Token invalide, veuillez réessayer.");
          }
        } else {
          alert("Token manquant dans la réponse.");
        }
      },
      (error) => {
        console.error(error);
        alert("Erreur lors de la connexion. Vérifiez vos informations et réessayez.");
      }
    );
  }

}
