import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/portal';
  }
  async getImage(user_id) {
    const obj = new Object();
    obj['user_id'] = user_id;
    const resp = await this.http.post(this.main.httpUrl + '/portal/getprofileimage', obj, { responseType: 'blob' }).toPromise().then(res => {
        return res;
      });
      if (resp) {
        return resp;
    }
  }
  async getAccImage(b_acct_id) {
    const obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    const resp = await this.http.post(this.httpUrl + '/getAccountImage', obj, { responseType: 'blob' }).toPromise().then(res => {
        return res;
      });
      if (resp) {
        return resp;
    }
  }
  async getUserProfileInfo(user_id){
    const res = await this.http.get<any>(this.httpUrl + '/getUserInfo'+user_id).toPromise().then(res => {
      return res;

    });
    return res;
  }
  async getEstablishmentInfo(obj){
    const res = await this.http.get<any>(this.main.httpUrl + '/hr/emp_info/empInfo/getUserInfo'+obj).toPromise().then(res => {
      return res;

    });
    return res;
  }
  async getPostingInfo(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/establishment_info/post/getAllAssignedPosts' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async getAllApproval(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/approval/getapproval' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllApprovalStatus(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/approval/getdataofapprovalstatus' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAccProfileInfo(user_id){
  
    const res = await this.http.get<any>(this.httpUrl + '/getAccountInfo'+user_id).toPromise().then(res => {
      return res;

    });
    return res;

  }
  async updateProfile(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/updateProfile', obj).toPromise().then(res => {
      return res;
     });
    return resp;
   }
  
   async updateAccProfile(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/updateAccountInfo', obj).toPromise().then(res => {
      return res;
     });
    return resp;
   }
   async changePassword(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/changePassword', obj).toPromise().then(res => {
      return res;
     });
    return resp;
   }
   //Updated New Api

   async getaccountmodule(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/systemdata/legalentity/getaccountmodule'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateProfileInfo(obj){
    console.log(obj)
   const resp = await this.http.put<any>(this.main.httpUrl + '/systemdata/legalentity/updateprofile', obj).toPromise().then(res => {
    console.log(res) 
    return res;
    });
    console.log(resp)
   return resp;
  }
  async changeUserPassword(obj){
   console.log(this.main.httpUrl,this.main)
  const resp = await this.http.post<any>(this.main.httpUrl + '/systemdata/legalentity/updatepassword', obj).toPromise().then(res => {
    return res;
   });
  return resp;
 }
 async updateACC_info(obj){
  console.log(this.main.httpUrl,this.main)
 const resp = await this.http.put<any>(this.main.httpUrl + '/systemdata/legalentity/updateaccountinfo', obj).toPromise().then(res => {
   return res;
  });
 return resp;
}

async getEmpID(obj){
  const resp = await this.http.get<any>(this.main.httpUrl + '/md/resource/getempidbyuserid'+obj).toPromise().then(res => {
    return res;
  });
  return resp;
}

async getUserDetailsForProfile(obj){
  const resp = await this.http.get<any>(this.main.httpUrl + '/md/user/getUserDetailsForProfile'+obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
async UpdateuserProfileDetails(obj){
  const resp = await this.http.put<any>(this.main.httpUrl + '/md/user/UpdateuserProfileDetails',obj).toPromise().then(res => {
    return res;
  });
  return resp;
}

}
