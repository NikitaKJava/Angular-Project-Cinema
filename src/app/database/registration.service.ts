import {catchError, Observable} from "rxjs";
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core"; // interface

import {IShow, Show} from "../models/show";
import {UserRegistration} from "../models/user"; // interface, class

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})

export class RegistrationService {

  constructor(private messageService: MessageService, private http: HttpClient) {
  }

  /** POST: add a new user to the database */
  addUser(newUser: UserRegistration): Observable<any> {
    this.messageService.add('RegistrationService: add new user');
    const body = JSON.stringify(newUser);
    console.log(body)
    return this.http.post<UserRegistration>('http://localhost:3000/api/register', body, httpOptions)
      .pipe(
        catchError(async () => console.log("ADD NEW USER ERROR"))
      );
  }
}
