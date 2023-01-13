import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {ErrorComponent} from "../error/error.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // properties for the login form
  username: string;
  password: string;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/api/login', body).subscribe(
      res => {
        // if the login is successful, navigate to the dashboard
        this.router.navigate(['/admin']).then(r => ErrorComponent );
      },
      err => {
        // if there's an error, display the error message
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
