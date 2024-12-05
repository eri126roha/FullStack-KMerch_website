// merch-list.component.ts

import { Component, OnInit } from '@angular/core';
import { MerchService } from '../services/merch.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-merch-list',
  templateUrl: './merchlist.component.html',
  styleUrls: ['./merchlist.component.css']
})
export class MerchListComponent implements OnInit {
  merchList: any[] = [];
  errorMessage: string = '';
  userId: string | null = null;

  constructor(private merchService: MerchService, private authService: AuthenticationService,
    private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId(); 
    this.getMerchandise();
  }

  // Function to add an item to the wishlist
  addToWishlist(merch: any): void {
    //merch.addedToWishlist = true;
    //alert('Item added to wishlist!');
    if (!this.authService.isAuthenticated()) {
      this.showLoginAlert();
      return;
    }
    merch.addedToWishlist = true;
    alert('Item added to wishlist!');
  }

  // Function to remove an item from the wishlist
  removeFromWishlist(merch: any): void {
    //merch.addedToWishlist = false;
    //alert('Item removed from wishlist!');
    if (!this.authService.isAuthenticated()) {
      this.showLoginAlert();
      return;
    }
    merch.addedToWishlist = false;
    alert('Item removed from wishlist!');
  }

  // Function to handle the purchase button click
  purchase(merch: any): void {
    //alert(`${merch.name} purchase button clicked!`); // Fixed template literal
    if (!this.authService.isAuthenticated()) {
      this.showLoginAlert();
      return;
    }
    alert(`${merch.name} purchase button clicked!`);
  }


  // Load the merch list from the backend
  getMerchandise(): void {
    this.merchService.getAllMerchs().subscribe({
      next: (data) => {
        this.merchList = data;
        console.log(this.merchList);
      },
      error: (err) => {
        console.error('Error fetching merch list:', err);
        this.errorMessage = 'Error loading merchandise. Please try again later.';
      },
    });
  }
  getImageUrl(imagePath: string): string {
    return `http://localhost:3001${imagePath}`; // Fixed template literal
  }

  // Helper function to show login alert
  private showLoginAlert(): void {
    if (
      confirm(
        'You must log in to perform this action. Do you want to log in now?'
      )
    ) {
      this.router.navigate(['/login']); // Redirect to the login page
    }
  }
  
}
