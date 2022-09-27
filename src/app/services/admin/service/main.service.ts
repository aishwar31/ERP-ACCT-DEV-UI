import { HttpClient, HttpEventType } from '@angular/common/http';

import { AuthenticationService } from '../../../authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  profileImageUrl;
  codeValueTechObj = {};
  accountImageUrl;
  accInfo = {}
  codeValueShowObj = {};
  //httpUrl="http://localhost:30001";
  // httpUrl="http://localhost:3000";

  httpUrl = this.auth.httpUrl;

  // httpUrl="https://vdaerp.svayamtech.com:3000";
  dateFormatChange(date) {
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-")

    return datearr[2] + '/' + datearr[1] + '/' + datearr[0]
  }

  async getPaymentGatwayData(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/paymentGateway/getPaymentGatwayData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAccountDetails(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getaccountmodule' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createProduct(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/admin/products/createProduct', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getProductList(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/admin/products/getProductList' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async deleteProduct(obj) {
    const res = await this.http.delete<any>(this.httpUrl + '/admin/products/deleteProduct' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getProductResource(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/admin/products/getProductResource' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updateProduct(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/admin/products/updateProduct', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async changeProduct(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/admin/products/changeProduct', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getFields(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/fields/getfields' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getCodeValue(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/codeValue/getCodeValues' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getCurrentLegalEntity(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getcurrentlegalentity' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getResource(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getcurrentresource' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getresourcebyrolecd(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getresourcebyrolecd' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getmodules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async createresource(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/admin/resource/createresource', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateresource(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/admin/resource/updateresource', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteresource(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/admin/resource/deleteresource', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAdminCodeValue(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/codevalue/getCodeValue' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createLegalEntity(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/legalentity/createindentity', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async createAccount(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/signup/signup', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async createRole(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/admin/role/createrole', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updateRole(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/admin/role/updateRole', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async inactiverole(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/admin/role/inactiverole', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }


  async createUser(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/admin/user/createuser', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getCurrentrole(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/role/getcurrentroles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getEmployee(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/user/getallemployee' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getEmpIdUserId(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/user/getEmpIdUserId' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async inactiveuser(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/admin/user/inactiveuser', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getCurrentUser(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/user/getcurrentuser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllCurrentAccoutns() {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getcurrentAccounts').toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async addUser(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/admin/user/adduser', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }


  async UpdateUserInfo(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/md/user/UpdateuserProfileDetails', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  // new code
  async getAllLanguages(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getAllLanguages' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getAllComponent(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getAllComponent' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async createLanguage(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/languages/createLanguage', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async addComponent(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/languages/addComponent', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getcomponentLabelvalueswithLanguage(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getcomponentLabelvalueswithLanguage' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async insertcomponentLabelvaluewithLanguage(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/languages/insertcomponentLabelvaluewithLanguage1', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }


  async updatecomponentLabelvaluewithLanguage(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/systemdata/languages/updatecomponentLabelvaluewithLanguage', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updateaccountinfo(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/systemdata/legalentity/updateaccountinfo', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  
  async deleteAccount(obj) {
  const res = await this.http.delete<any>(this.httpUrl + '/systemdata/legalentity/deleteAccount' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

}


