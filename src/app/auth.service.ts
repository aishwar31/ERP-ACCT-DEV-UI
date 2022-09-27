import { Injectable } from '@angular/core';
import { MainService } from './portal/service/main.service'

// import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public mainService: MainService, ) { }

  erpUser;
  allComponentCode = [];
  public async isAuthenticated() {
    this.erpUser = JSON.parse(sessionStorage.getItem('erpUser'));
    // console.log(this.erpUser, 'erpUser')
    this.allComponentCode = this.erpUser.assigned_component;
    // console.log(this.allComponentCode, 'all assigned component before');

    if (this.allComponentCode == undefined || this.allComponentCode.length==0) {
      this.allComponentCode = await this.getAllAssignedComponent(this.erpUser.b_acct_id, this.erpUser.role_cd);
      // console.log(this.allComponentCode, 'all component code after')
      var erpUser1 = JSON.parse(sessionStorage.getItem('erpUser'));
      erpUser1['assigned_component'] = this.allComponentCode;
      sessionStorage.setItem('erpUser', JSON.stringify(erpUser1));
    }
    var ComponentCode = this.mainService.componentCode;
    // console.log(this.allComponentCode, ComponentCode, 'coldes')
    if (this.allComponentCode.indexOf(ComponentCode) < 0) {
      // if((this.erpUser['role_cd'].includes("HR_ADMIN") && ComponentCode=='HR-ADMIN')||(this.erpUser['role_cd'].includes("AA") && ComponentCode=='HR-ADMIN')){
      //   return true;
      // }
      return false;
    } else {
      return true;
    }

  }

  async getAllAssignedComponent(b_acct_id, role_cd) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    obj['role_cd'] = role_cd;
    // console.log(obj);

    var allComponentCode1 = [];
    var resp = await this.mainService.getAllAssignedComponents(JSON.stringify(obj));
    // console.log(resp)
    if (resp['error'] == false) {
      for (let i = 0; i < resp['data'].length; i++) {
        allComponentCode1.push(resp['data'][i]['resource_cd'])
      }
    } else {

    }
    return allComponentCode1;


  }


}