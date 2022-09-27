import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async manualloginWithOtp(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/authentication/manualloginWithOtp'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getUserAuthinfo(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/administration/user/getUserAuthinfo'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getvendor(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/info/party/getvendor'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async signUp(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/signup', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async forgotPass(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/sendUserPassword', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  
  async getInd(){
    const res = await this.http.get<any>(this.httpUrl + '/getindustries').toPromise().then(res => {
      return res;
    });
    return res;
  }
  async signloginwithsocialsiteIn(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/authentication/sociallogin'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async manuallogin(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/authentication/manuallogin'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async getUserAccessComponentInfo(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/authentication/getUserAccessComponentInfo'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async getComponentInfo(obj){
  //   const resp = await this.http.get<any>(this.httpUrl + '/authentication/getComponentInfo'+ obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  async getComponentInfo(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/administration/AccountRoles/getAllRolesWIthResource'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  

  
  async sendPass(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/senduserpassword', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }



  async sendMsg(mobile,otp) {
    console.log(otp+"@123")
    // var str="https://2factor.in/API/V1/f5b33455-838a-11ea-9fa5-0200cd936042/SMS/"+mobile+"/"+otp+"/SAVAYM+OTP"
    var str="https://2factor.in/API/V1/f5b33455-838a-11ea-9fa5-0200cd936042/SMS/"+mobile+"/"+otp+"/ERPUPDA"
    //var str="https://2factor.in/API/R1/?module=TRANS_SMS&apikey=f5b33455-838a-11ea-9fa5-0200cd936042&to="+mobile+"&from=BDCASR&templatename=OTP&var1="+otp+"&var2=VAR2_VALUE"
    const resp =this.http.get<any>(str).toPromise().then(res => {
      return res;
    });
    return resp;


    // this.http.get(str,(error2,res2,body2)=>{
    //        console.log(res2);
    //        return res2;
    // });

    // const resp = await this.http.get<any>(str).subscribe(res => {
    //   return res;
    // });
    // return resp;
  }


}
