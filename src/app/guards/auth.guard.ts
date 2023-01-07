import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router  } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// export class AuthGuard implements CanActivate {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return true;
//   }
  
// }
  export class AuthGuard implements CanActivate {      
     constructor(private router: Router) { }      
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {      
        if (this.isLoggedIn()) {      
        return true;      
        }      
        // navigate to login page as user is not authenticated      
     this.router.navigate(['/login']);      
  return false;      
  }      
  public isLoggedIn(): boolean {      
     let status = false;      
     if (localStorage.getItem('isLoggedIn') == "true") {      
        status = true;      
     }
       else {      
        status = false;      
        }      
     return status;      
     }    
  }    