import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { LoginComponent } from './login/login.component';  
import { DashboardComponent } from './dashboard/dashboard.component'
import {OverviewComponent} from "./overview/overview.component";
import {ShowComponent} from "./show/show.component";
import {ContactComponent} from "./contact/contact.component";
import {AdminComponent} from "./admin/admin.component";
import { AuthGuard } from './guards/auth.guard'; 

const routes: Routes = [ // sets up routes constant where you define your routes
  {path:"home", component: HomeComponent},
  {path:"overview", component: OverviewComponent}, // overview of all available movies
  {path:"overview/show/:id", component: ShowComponent}, // single show page access only over link
  {path:"contact", component: ContactComponent}, // contact data program
  {path:"admin", component: AdminComponent}, // admin page access only over link
  {path: 'login', component: LoginComponent },  
  {path: 'dashboard', component: DashboardComponent, canActivate : [AuthGuard] }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
