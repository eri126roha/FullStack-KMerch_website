import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MerchService } from '../services/merch.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-merch-form',
  templateUrl: './merch-form.component.html',
  styleUrls: ['./merch-form.component.css']
})
export class MerchFormComponent implements OnInit {
  merchForm!: FormGroup;
  selectedImage: File | null = null;
  imageError: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private merchService: MerchService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.merchForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      sellerId: ['', Validators.required],
     // imageUrl: [null, [Validators.required]] // Image validation
    });
  }

  ngOnInit(): void {
    // Get the sellerId from AuthenticationService
    const sellerId = this.authenticationService.getCurrentUserId();
    console.log('Fetched Seller ID:', sellerId);  // Log the ID to verify it's being fetched correctly

    if (sellerId) {
      // If a valid sellerId is returned, patch it into the form
      this.merchForm.patchValue({
        sellerId: sellerId
      });
    } else {
      console.error('No seller ID found');
      this.router.navigate(['/login']);  // Redirect to login if sellerId is not found
    }
  }

  // Handle image file selection
 onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Please select an image file';
        return;
      }
      this.selectedImage = file;
      this.imageError = ''; // Clear any error messages
      this.merchForm.patchValue({ imageUrl: file }); // Set imageUrl in form
    }
  }
  

  // Function to handle form submission
  onSubmit(): void {
    console.log("eeee")

    /*if (this.merchForm.invalid || this.imageError || !this.selectedImage) {
      return;
    }
  */
    const formData = new FormData();
    formData.append('name', this.merchForm.value.name);
    formData.append('description', this.merchForm.value.description);
    formData.append('price', this.merchForm.value.price);
    formData.append('category', this.merchForm.value.category);
    formData.append('sellerId', this.merchForm.value.sellerId);
  
    if (this.selectedImage) {
      console.log("imd"+this.selectedImage.name)
      formData.append('imageUrl', this.selectedImage, this.selectedImage.name);
    }
  
    this.merchService.addMerch(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Merchandise added successfully!';
        this.router.navigate(['/merchlist']); // Redirect to the list of merchandise
      },
      error: (err) => {
        this.errorMessage = 'Error adding merchandise. Please try again later.';
      },
    });
  }
  

  // Function to handle form reset
  onReset(): void {
    this.merchForm.reset();
    this.imageError = ''; 
    this.selectedImage = null; 
    this.successMessage = '';
    this.errorMessage = '';
  }
  
}
