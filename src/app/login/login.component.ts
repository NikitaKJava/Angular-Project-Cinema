import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

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

  constructor(private http: HttpClient, private router: Router) {
  }

  login(): void {
    const user = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/api/login', user).subscribe(
      res => {
        // if the login is successful, navigate to the dashboard
        this.loggedIn.next(true);
        console.log(this.loggedIn)
        this.router.navigate(['/admin']).then(() => {
        });
      },
      err => {
        // if there's an error, display the error message
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  logout() {

    this.http.get<any>('http://localhost:3000/api/logout').subscribe(
      res => {
        // if the login is successful, navigate to the dashboard
        this.router.navigate(['/overview']).then(() => this.loggedIn.next(false));
      },
      err => {
        // if there's an error, display the error message
        this.errorMessage = 'logout failed';
      }
    );
  }
}
