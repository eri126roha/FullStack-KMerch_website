import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ListusersComponent } from './listusers/listusers.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { HomeComponent } from './home/home.component';
import {AuthGuard}from './auth.guard';
import { ProfilComponent } from './profil/profil.component';
import { AboutComponent } from './about/about.component';
import { MerchListComponent } from './merchlist/merchlist.component';
import { CategoryMerchsComponent } from './category-merchs/category-merchs.component';
import { MyMerchsComponent}from './my-merchs/my-merchs.component';
import { MerchFormComponent } from './merch-form/merch-form.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'Profil', component: ProfilComponent,canActivate:[AuthGuard] },
  { path: 'listusers', component: ListusersComponent},
  { path: 'about', component: AboutComponent},
  { path: 'merchlist', component: MerchListComponent},
  { path: 'categorymerch', component: CategoryMerchsComponent},
  { path: 'mymerchs', component: MyMerchsComponent,canActivate:[AuthGuard]},
  { path: 'merchform', component: MerchFormComponent, canActivate:[AuthGuard]},
  { path: 'wishlist', component: WishlistComponent, canActivate:[AuthGuard]},


  {path:'users/update/:id', component: UpdateUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
