import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable } from 'rxjs';
import {tap } from 'rxjs/operators';
import {Router} from "@angular/router";
import { HttpClient} from "@angular/common/http";
import {User, UserObject} from "../models/user";

const USER_KEY = 'DATA';
const LOGIN_KEY = 'ISLOGGEDIN';
const ADMIN_KEY = 'ISADMIN';

@Injectable({
  providedIn: 'root',
})

export class AuthService{
  //To control if the user is logged in or not, we will use a BehaviorSubject
  private loggedIn = new BehaviorSubject<boolean>(this.getisLoginFromLocalStorage());
  private isAdminRole = new BehaviorSubject<boolean>(this.getisAdminFromLocalStorage());
  public userName: string;
  private user: User = this.getUserFromLocalStorage();
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

  get username():string {
    return this.user.userName; // {2}
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
          this.user.password = "";
          this.loggedIn.next(true);
          console.log("api/admin");
          this.checkForAdmin();

        },
        error: (errorResponse) => {
          this.user.password = "";
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
          this.setDataToLocalStorage(this.user, this.loggedIn.value, this.isAdminRole.value);
        },
        error: (errorResponse) => {
          console.log("errorResponse");
          console.log("not admin");
          this.isAdminRole.next(false);
          this.setDataToLocalStorage(this.user, this.loggedIn.value, this.isAdminRole.value);
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
              this.setDataToLocalStorage(this.user, this.loggedIn.value, this.isAdminRole.value);
            },
            error: (errorResponse) => {
              console.log(errorResponse);
            }
          })).subscribe();
  }

  private setDataToLocalStorage(user:User, loggedIn:boolean, isAdminRole:boolean){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LOGIN_KEY, JSON.stringify(loggedIn));
    localStorage.setItem(ADMIN_KEY, JSON.stringify(isAdminRole));
  }

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new UserObject();
  }

  private getisLoginFromLocalStorage():boolean{
    const loginJson = localStorage.getItem(LOGIN_KEY);
    if(loginJson) return JSON.parse(loginJson) as boolean;
    return false;
  }

  private getisAdminFromLocalStorage():boolean{
    const adminJson = localStorage.getItem(ADMIN_KEY);
    if(adminJson) return JSON.parse(adminJson) as boolean;
    return false;
  }

}
