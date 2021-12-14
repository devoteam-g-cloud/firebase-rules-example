import {Injectable} from '@angular/core';
//import {AngularFireAuth} from '@angular/fire/compat/auth';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  isExpiredToken(claims: any) {
    const d = new Date().getTime() / 1000;
    if (d - claims.auth_time >= 3600) {
      return true;
    }
    return false;
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.authService.claims) {
      return true;
    }
    return this.authService.authenticationState
    .pipe(take(1))
    .pipe(map((claims: any) => {
      if (claims && this.isExpiredToken(claims)) {
        console.log('token expired. Redirecting to login..')
        this.router.navigate(['login']);
        return false;
      }
      if (!claims) {
        this.authService.logout();
        return false;
      }
      return true;
      
    }));
  }
}
