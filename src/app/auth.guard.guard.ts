import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from './shared/auth.service';

import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
 /* canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log('Felhasználó be van jelentkezve!');
      return true;
    } else {
      console.log('Felhasználó visszairanyitva!');
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
