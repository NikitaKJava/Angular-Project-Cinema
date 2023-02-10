import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, delay, tap } from 'rxjs/operators';
import {Router} from "@angular/router";
import { HttpClient, HttpResponse  } from "@angular/common/http";
import {User, UserObject} from "../models/user";

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  //To control if the user is logged in or not, we will use a BehaviorSubject
  private loggedIn = new BehaviorSubject<boolean>(false);
  private isAdminRole = new BehaviorSubject<boolean>(false);
  public userName: string;
  private user: User;
  public loggedInObservable:Observable<boolean>;
  public isAdminRoleObservable:Observable<boolean>;
  
  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  constructor(private router: Router, private http: HttpClient) {
    this.loggedInObservable = this.loggedIn.asObservable();
    this.isAdminRoleObservable = this.isAdminRole.asObservable();
  }

  // We will also create a getter to expose only the get method publicly
  // as also expose the Subject as an Observable. The BehaviorSubject keeps
  // the latest value cached (in our case when the service is created the
  // initial value is going to be false. So when an Observer subscribes to
  // the isLoggedIn(), the cached valued is going to be emitted right away.
  get isLoggedIn():boolean {
    return this.loggedIn.value; // {2}
  }

  get isAdmin():boolean {
    return this.isAdminRole.value; // {2}
  }

  // If we received a userName and a password ({3}), then we authenticate the user. This means we need to emit
  // that the user is now logged in and also redirect the routing to the HomeComponent.

login(user: User): Observable<boolean> {
  console.log("1");
  console.log(user);
  this.user = user;

  return this.http.post<boolean>('http://localhost:3000/api/login', { "username": user.userName, "password": user.password }).pipe(
    tap({
        next: (user) =>{
          this.loggedIn.next(true);
          console.log("api/admin");
          this.checkForAdmin();
        },
        error: (errorResponse) => {
          this.loggedIn.next(false);
        }
      }
      )
      );

  // return this.http.post('http://localhost:3000/api/login', { "username": user.userName, "password": user.password }).pipe(
  //   map((response) => {
  //       this.loggedIn.next(true);

  //       // request if the user is an admin
  //       this.http.get('http://localhost:3000/api/admin').pipe(
  //         map((adminResponse) => {
  //             this.user.role = 'admin';
  //             this.isAdminRole.next(true);
  //           return this.loggedIn.value;
  //         })
  //       ).subscribe();
  //       return this.loggedIn.value;
  //   })
  // );
}

checkForAdmin() {
  console.log("check for");
  this.http.get<any>('http://localhost:3000/api/admin').pipe(
    tap({
        next: () =>{
          console.log("admin");
          this.user.role = 'admin';
          this.isAdminRole.next(true);
        },
        error: (errorResponse) => {
          console.log("errorResponse");
          console.log("not admin");
          this.isAdminRole.next(false);
        }
      })).subscribe();
}

  logout() {
    console.log(this.loggedIn);
    return this.http.get<any>('http://localhost:3000/api/logout').pipe(
      tap({
            next: (user) =>{
              console.log(user);
              this.user = new UserObject();
              this.loggedIn.next(false);
              this.isAdminRole.next(false);
            },
            error: (errorResponse) => {
              console.log(errorResponse);
            }
          })).subscribe();
  }
}
