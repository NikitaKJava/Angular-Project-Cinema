import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "./auth.service";
import {User} from "../models/user";
import {UserObject} from "../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  // properties for the login form
  private loggedIn = new BehaviorSubject<boolean>(false);
  username: string;
  password: string;
  errorMessage: string;

constructor(
  private http: HttpClient,
  private router: Router,
  private authService: AuthService) {
}

  login(): void {
    let user = new UserObject();
    user.userName=this.username;
    user.password=this.password;
    user.role="user";

    this.authService.login(user).subscribe(
  res => {
    // if the login is successful, navigate to the dashboard
    this.authService.checkForAdmin();
    this.router.navigate(['/overview']).then(() => {
    });
  },
  err => {
    // if there's an error, display the error message
    this.errorMessage = 'Invalid username or password';
  }
);
  }

//   logout() {
//   this.authService.logout().subscribe(
//     res => {
//       // if the logout is successful, change the loggedIn subject's value to false and navigate to the overview page
//       this.loggedIn.next(false);
//       this.router.navigate(['/overview']).then(() => {
//       });
//     },
//     err => {
//       // if there's an error, display the error message
//       this.errorMessage = 'Logout failed';
//     }
//   );
// }
}
