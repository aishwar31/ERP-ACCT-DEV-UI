// src/app/auth/role-guard.service.ts
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { MainService } from './portal/service/main.service'
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(public mainService: MainService, public auth: AuthService, public router: Router) { }
  async canActivate(route: ActivatedRouteSnapshot) {
    this.mainService.componentCode = route.data.ComponentCode;

    if (! await this.auth.isAuthenticated()) {
      swal.fire("Sorry", "You are not allow to this component Access..!", 'info');
      // console.log(this.router.url,'url')
      if (this.router.url != "/index") {
        this.router.navigate(['/index']);
      }
      return false;
    }
    return true;
  }
}