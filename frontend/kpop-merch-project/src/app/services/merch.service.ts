import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';  // Assuming you are using ngx-cookie-service

@Injectable({
  providedIn: 'root'
})
export class MerchService {
  private apiUrl = 'http://localhost:3001/api/merchandises';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Helper function to get the authentication token from cookies
  private getAuthToken(): string | null {
    return this.cookieService.get('auth_token');  // Retrieve token from cookies
  }

  // Helper function to create headers with the token
  private createAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    console.log('Auth Token:', token);  // For debugging purposes
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Get all merchandise (public access, no authentication required)
  getAllMerchs(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get merchandise by category (public access, no authentication required)
  getMerchsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}`);
  }

  // Get merchandise added by the authenticated user
  getMyMerchs(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  // Helper function to create FormData for merchandise and image
  private createFormData(merch: any, image: File | null): FormData {
    const formData = new FormData();
    formData.append('name', merch.name);
    formData.append('description', merch.description);
    formData.append('price', merch.price);
    formData.append('sellerId', merch.sellerId);
    formData.append('category', merch.category);

    if (image) {
      formData.append('imageUrl', image, image.name);  // Append the image to FormData
    }
    return formData;
  }

  // Add merchandise (requires authentication)
  addMerch(formData: FormData): Observable<any> {
    const headers = this.createAuthHeaders();
    console.log("dataaaa"+formData.getAll.toString)
    return this.http.post(`http://localhost:3001/api/merchandises/addMerch`, formData, { headers });
  }

  // Update merchandise (requires authentication)
  updateMerch(id: string, merch: any, image: File | null): Observable<any> {
    const headers = this.createAuthHeaders();
    const formData = this.createFormData(merch, image);  // This will handle the FormData
  
    return this.http.put(`http://localhost:3001/api/merchandises/${id}`, formData, { headers });
  }
  

  // Delete merchandise (requires authentication)
  deleteMerch(id: string): Observable<any> {
    console.log('Deleting merch with ID:', id);

    const headers = this.createAuthHeaders();
    return this.http.delete(`http://localhost:3001/api/merchandises/${id}`, { headers });
  }

  // Add to wishlist (requires authentication)
  addToWishlist(merchId: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.apiUrl}/${merchId}/wishlist`, {}, { headers });  // Assuming the backend accepts no additional data
  }

  // Get user's wishlist (requires authentication)
  getWishlist(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/wishlist`, { headers });  // Assuming the backend has this endpoint
  }
  
  // Remove from wishlist (requires authentication)
  removeFromWishlist(merchId: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${merchId}/wishlist`, { headers });
  }

  // Decrement stock (requires authentication)
  decrementStock(id: string, quantity: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.patch(`${this.apiUrl}/${id}/decrement`, { quantity }, { headers });
  }

   // Fetch merchandise items for a specific user (requires authentication)
  getUserMerchs(userId: string | null): Observable<any[]> {
    if (!userId) {
      return new Observable<any[]>(); // Return empty if no user ID
    }
    return this.http.get<any[]>(`http://localhost:3001/api/merchandises/mymerchs/${userId}`);
  }

}
