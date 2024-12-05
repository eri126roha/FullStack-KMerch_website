import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';  
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {};

  constructor(private userServices: AuthenticationService, private router: Router) {}

  register() {
    const userData = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,

    };

    this.userServices.registerUser(userData).subscribe(
      (response) => {
        console.log(response);
        alert('Inscription réussie:');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        // Affichez un message d'erreur à l'utilisateur si besoin
      }
    );
  }
}

