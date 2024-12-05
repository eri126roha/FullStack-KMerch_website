import { Component ,OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrl: './listusers.component.css'
})
export class ListusersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: AuthenticationService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
  getUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }
  onDeleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        alert('Utilisateur supprimé avec succès');
        this.getUsers(); // Mettre à jour la liste après la suppression
      }, error => {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
        alert('Une erreur est survenue lors de la suppression.');
      });
    }
  }
}
