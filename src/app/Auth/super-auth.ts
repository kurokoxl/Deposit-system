import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.sharedService.isSuperAdmin$().pipe(
      tap(isSuperAdmin => {
        if (!isSuperAdmin) {
          // If user is not a super admin, redirect to login page or access denied page
          this.router.navigate(['/dashboard']);
          return false; // You can redirect to a different page if needed
        }
        else{
        console.log('addmmiinn');

         return true
        }
      })
    );
  }
}
