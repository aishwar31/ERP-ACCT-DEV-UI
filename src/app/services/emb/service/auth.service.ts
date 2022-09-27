import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public mainService: MainService, public loginService: LoginService) { }

  ebillUser;
  allComponentCode = [];

  public async  isAuthenticated() {
    // return true;

    this.ebillUser = JSON.parse(localStorage.getItem('ebillUser'));

    if(this.ebillUser['role_cd']=='AA' && this.mainService.componentCode=='LOA' ){
      return true;
    }
    if((this.ebillUser['role_cd']=='AA' || this.ebillUser['role_cd']=='ZA') && this.mainService.componentCode=='CU' ){
      return true;
    }
    if(this.ebillUser['role_cd']=='ZA' && (this.mainService.componentCode=='PH' || this.mainService.componentCode=='WH' || this.mainService.componentCode=='ZH') ){
      return true;
    }
    if(this.ebillUser['role_cd']=='AA' && this.mainService.componentCode=='CR' ){
      return true;
    }
    this.allComponentCode = this.ebillUser.assigned_component;
    if (this.allComponentCode == undefined) {
      await this.getAllAssignedComponent(this.ebillUser.b_acct_id,this.ebillUser.role_cd);
      this.ebillUser = JSON.parse(localStorage.getItem('ebillUser'));
      this.allComponentCode = this.ebillUser.assigned_component;
    }
    var ComponentCode = this.mainService.componentCode;
    if (this.allComponentCode.indexOf(ComponentCode) < 0) {
      return false;
    } else {
      return true;
    }
  }


  async getAllAssignedComponent(b_acct_id,role_cd) {
    var obj=new Object();
    obj['b_acct_id']=b_acct_id;
    obj['role_cd']=role_cd;
    console.log(obj)
    var resp = await this.loginService.getComponentInfo(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      var allComponentCode=[];
      if(resp.data[0]['res_cd']!=null ){
        allComponentCode = resp.data[0]['res_cd'].split(",");
      }
    
      if(allComponentCode.length==0){
        allComponentCode=['R1']
      }
      var ebillUser = JSON.parse(localStorage.getItem('ebillUser'));
      ebillUser['assigned_component'] = allComponentCode;
      localStorage.setItem('ebillUser', JSON.stringify(ebillUser));
    } else {
    }

  }


}