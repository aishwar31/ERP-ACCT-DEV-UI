// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      swal.fire("Sorry", "You are not allow to this component Access..!");
      var erpUser = JSON.parse(localStorage.getItem('erpUser'));
      // console.log(erpUser)

      if(erpUser['b_acct_id']==0){
        this.router.navigate(['./solution-admin/index']);
      }else{
        this.router.navigate(['./index']);
      }

      return false;
    }
    return true;
  }
}