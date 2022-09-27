import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  ddHost = environment.ddHost || "http://192.168.29.219"
  login_with_password = environment.loginWithPassword || false;
  apiHost = environment.apiHost || "https://localhost"
  apiPort = environment.apiPort || "3006"
  version = "22-05-2021";
  httpUrl;
  profile_data = '';
  constructor(private http: HttpClient) {

    this.httpUrl = this.apiHost + ":" + this.apiPort;
    console.log("API @ " + this.httpUrl + " is being used.");

  }

  changeLanguage() {
    if (this.language_cd == null || this.language_cd == undefined) {
      this.language_cd = 'ENG'
    }
  }

  allLanguage = []
  allLableShowObj = {};
  allLabel = [];
  language_cd;
  allLableShowObjProp = {};
  allLabelProp = [];
  allLableShowObjHR = {};
  allLabelHR = [];
  allLableShowObjSA = {};
  allLabelSA = [];
  allSystemModuleObj = {};

  async getSystemModule() {
    var obj = new Object();
    obj['b_acct_id'] = 0;
    var resp = await this.getModules(JSON.stringify(obj));
    if (resp['error'] == false) {
      var obj = new Object();
      for (let i = 0; i < resp.data.length; i++) {
        obj[resp.data[i]['module_cd']] = resp.data[i]['module_name']
      }
      this.allSystemModuleObj = obj;

    } else {

    }
  }


  async signUp(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/signup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }



  async login(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/login', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllLanguages(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getAllLanguages' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getmodules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getcomponentLabelvalueswithLanguage(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getcomponentLabelvalueswithLanguage' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async sendMsg(mobile) {
    var str = "https://2factor.in/API/V1/" + this.api_key + "/SMS/" + mobile + "/AUTOGEN"
    const resp = await this.http.get<any>(str).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  api_key1 = 'f5b33455-838a-11ea-9fa5-0200cd936042';
  api_keyprincy = '88d80fb3-8fb4-11ec-a4c2-0200cd936042'
  api_key = '3f111667-df8d-11ec-9c12-0200cd936042'

  async verifyMsg(otp_entered_by_user, session_id) {
    var str = "https://2factor.in/API/V1/" + this.api_key + "/SMS/VERIFY/" + session_id + "/" + otp_entered_by_user
    const resp = await this.http.get<any>(str).toPromise().then(res => {
      return true
    }).catch(err => {
      return false
    });
    return resp;
  }

  async getaccountmodule(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getaccountmodule' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getCurrentrole(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/role/getcurrentroles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getCurrentroleForAccount(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getcurrentroles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getCurrentUserFromAdmin(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/user/getcurrentuser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getCurrentUserFromMD(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/user/getcurrentuser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async loginERP(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/systemdata/authentication/login', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createloginInfo(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/systemdata/loginInfo/createloginInfo', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getDataFromMobileNumberOrEmail(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getDataFromMobileNumberOrEmail' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

}
