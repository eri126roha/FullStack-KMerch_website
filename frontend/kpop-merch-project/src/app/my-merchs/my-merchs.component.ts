import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MerchService } from '../services/merch.service';

@Component({
  selector: 'app-my-merchs',
  templateUrl: './my-merchs.component.html',
  styleUrls: ['./my-merchs.component.css']
})
export class MyMerchsComponent implements OnInit {
  myMerchs: any[] = [];
  userId: string | null = null;
  selectedImageFile: File | null = null; // For holding the selected image file
  updatedMerch: any = { name: '', description: '', price: 0, category: '' }; // Form for updating merch
  selectedMerchId: string | null = null; // Store selected merch ID for editing


  constructor(
    private merchService: MerchService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUserId(); // Get logged-in user ID

    if (this.userId) {
      // Fetch the user's added merch items
      this.fetchUserMerchs();
    }
  }

  fetchUserMerchs(): void {
    this.merchService.getUserMerchs(this.userId).subscribe(
      (merchs) => {
        console.log('Fetched merchs:', merchs); // Debug log to check fetched data
        this.myMerchs = merchs;
      },
      (error) => {
        console.error('Error fetching user merchs:', error);
      }
    );
  }

  // Update merch (for the logged-in user)
  updateMerch(merchId: string): void {
    const imageFile = this.selectedImageFile; // Get the image file if uploaded, otherwise pass null
    this.merchService.updateMerch(merchId, this.updatedMerch, imageFile).subscribe(
      (updatedMerch) => {
        console.log('Merch updated:', updatedMerch);
        this.fetchUserMerchs(); // Refresh list after update
      },
      (error) => {
        console.error('Error updating merch:', error);
      }
    );
  }

  /// Delete merch (for the logged-in user)
  deleteMerch(merchId: string): void {
    console.log('Attempting to delete merch with ID:', merchId);
    fetch('http://localhost:3000/api/merchandises/' + merchId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here (e.g., Authorization: Bearer <token>)
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Merchandise deleted:', data);
        // Optionally update the UI or notify the user of successful deletion
      })
      .catch(error => {
        console.error('Error:', error);
        // Optionally notify the user of an error
      });
  
  }

  confirmDelete(merchId: string): void {
    const confirmed = confirm('Are you sure you want to delete this merch?');
    if (confirmed) {
      this.deleteMerch(merchId);
    }
  }
  

  // Handle image file selection
  onImageSelected(event: any): void {
    this.selectedImageFile = event.target.files[0]; // Get the selected file
  }

  // Handle form submission for updating merchandise
  onUpdateMerch(merchId: string): void {
    this.selectedMerchId = merchId; // Set the selected merch ID for editing
    this.updateMerch(merchId);
  }
  getImageUrl(imagePath: string): string {
    return `http://localhost:3001${imagePath}`; // Fixed template literal
  }
}
