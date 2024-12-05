import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { User } from '../models/user.model'; 
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user!: User;
  userId!: string | null;
  isEditing:boolean=false;

  successMessage: string = '';  // Variable to hold success message
  errorMessage: string = '';    // Variable to hold error message
  

  constructor(private userService: AuthenticationService, private router: Router) {}

  
  ngOnInit(): void {
    // Récupérez l'ID de l'utilisateur connecté
    this.userId = this.userService.getLoggedInUserId();
    console.log("ttt"+this.userId)
    if (this.userId) {
      this.fetchUserData();
    } else {
      console.error('Utilisateur non connecté ou ID non disponible.');
    }
  }

  fetchUserData(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      },
    });
  }

  // Toggle the edit mode (for the Update button)
  updateProfile() {
    this.isEditing = true;
    this.successMessage = ''; // Clear any previous success message
    this.errorMessage = '';   // Clear any previous error message
  }

  // Save the updated profile
  saveChanges() {
    if (this.userId) {
      this.userService.updateUserProfile(this.userId, this.user).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          this.successMessage = 'Your profile has been updated successfully!';
          this.errorMessage = ''; // Clear any previous error message
          this.isEditing = false; // Exit edit mode
        },
        error: (err) => {
          console.error('Error updating profile', err);
          this.successMessage = ''; // Clear any previous success message
          this.errorMessage = 'There was an error updating your profile. Please try again later.';
        
        }
      });
    }
  }

  // Cancel the update and revert to the original data
  cancelEdit() {
    this.isEditing = false; // Exit edit mode without saving changes
    this.fetchUserData(); // Re-fetch the original data in case of cancel
    this.successMessage = ''; // Clear any previous success message
    this.errorMessage = '';   // Clear any previous error message
  }

  // Show confirmation dialog for delete account
  confirmDeleteAccount() {
    const confirmDeletion = confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmDeletion) {
      this.deleteAccount();
    }
  }

  // Delete user account
  deleteAccount() {
    if (this.userId) {
      this.userService.deleteUserAccount(this.userId).subscribe({
        next: (response) => {
          console.log('Account deleted successfully', response);
          // After successful deletion, navigate to the register page
          this.router.navigate(['/register']); // Navigate to register page
        },
        error: (err) => {
          console.error('Error deleting account', err);
          this.errorMessage = 'There was an error deleting your account. Please try again later.';
        }
      });
    }
  }

}
