import { Component } from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isLoggedIn$: Subscription


  constructor(private authService: AuthService) { }

  ngOnInit() {
    console.log(this.isLoggedIn$)
    this.isLoggedIn$ = this.authService.isLoggedIn.subscribe();
    console.log(this.isLoggedIn$)
  }

  onLogout(){
    console.log(this.isLoggedIn$)
    this.isLoggedIn$ = this.authService.isLoggedIn.subscribe()
    console.log(this.isLoggedIn$)
  }
}
