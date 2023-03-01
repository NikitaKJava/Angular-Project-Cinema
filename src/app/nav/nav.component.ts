import { Component, SimpleChanges, OnChanges} from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isLoggedIn:boolean;
  isAdmin:boolean;


  constructor(private authService: AuthService) { 
    authService.loggedInObservable.subscribe((newIsLoggedIn) => {
      this.isLoggedIn = newIsLoggedIn;
    });
    authService.isAdminRoleObservable.subscribe((newisAdmin) => {
      this.isAdmin = newisAdmin;
    });
  }

  ngOnInit() {
  }

  ngOnLoad(){
    console.log(this.isLoggedIn);
    this.isAdmin = this.authService.isAdmin;
    this.isLoggedIn = this.authService.isLoggedIn;
    console.log(this.isLoggedIn);
  }

  get isAuth(){
    return this.isLoggedIn;
  }
  get isAdminCheck(){
    return this.isAdmin;
  }

  onLogout(){
    this.authService.logout();
    // console.log(this.isLoggedIn$)
    //this.isLoggedIn$ = this.authService.isLoggedIn.subscribe()
    // console.log(this.isLoggedIn$)
  }
}
