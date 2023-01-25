import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import {Router} from "@angular/router";

import {User} from "../models/user";

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  //To control if the user is logged in or not, we will use a BehaviorSubject
  loggedIn = new BehaviorSubject<boolean>(false);

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  constructor(private router: Router) {
  }

  // We will also create a getter to expose only the get method publicly
  // as also expose the Subject as an Observable. The BehaviorSubject keeps
  // the latest value cached (in our case when the service is created the
  // initial value is going to be false. So when an Observer subscribes to
  // the isLoggedIn(), the cached valued is going to be emitted right away.
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  // If we received a userName and a password ({3}), then we authenticate the user. This means we need to emit
  // that the user is now logged in and also redirect the routing to the HomeComponent.
  // login(user: User) {
  //   if (user.userName !== '' && user.password !== '') { // {3}
  //     this.router.navigate(['/overview']).then(() => this.loggedIn.next(true));
  //   }
  // }
  //
  // // And in case the user logs out of the application {3}4, we will emit that the user is no longer logged in and also redirect to the login page.
  // logout() { // {4}
  //   this.loggedIn.next(false);
  //   this.router.navigate(['/login']).then(() => {
  //   });
  // }

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => this.loggedIn.next(true))
    );
  }

  logout(){
    console.log(this.loggedIn)
    this.loggedIn.next(false);
    this.router.navigate(['/login']).then(r => {});
    console.log(this.loggedIn)
  }
}
