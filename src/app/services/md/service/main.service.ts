import { HttpClient, HttpEventType } from '@angular/common/http';

import { AuthenticationService } from '../../../authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient ,private auth:AuthenticationService) { }
  profileImageUrl;
  codeValueTechObj = {};
  accountImageUrl;
  accInfo = {}
  codeValueShowObj = {};
  selectedModuleForCommonWorkFlow;
  //httpUrl="http://localhost:30001";
  // httpUrl="http://localhost:3000";
  httpUrl = this.auth.httpUrl;
  // httpUrl="https://vdaerp.svayamtech.com:3000";
  dateFormatChange(date) {
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-")
    return datearr[2] + '/' + datearr[1] + '/' + datearr[0]
  }
  changeLanguage() {
    if (this.language_cd == null || this.language_cd == undefined) {
      this.language_cd = 'ENG'
    }
    console.log(this.language_cd)
  }

  allLanguage = []
  allLableShowObj = {};
  allLabel = [];
  language_cd='ENG';
  async getFields(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/fields/getfields' + obj).toPromise().then(res => {
      return res;

    });
    return res;
  }
  async getAllUsersForAllModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/user/getAllUsersForAllModules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
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

  async getAccountModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getAccountModules' + obj).toPromise().then(res => {
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

  async getApprovalroles(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getApprovalroles' + obj).toPromise().then(res => {
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
  async createUser(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/admin/user/createuser', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getCurrentrole(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getcurrentroles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  // async getCurrentUser(obj){
  //   const resp = await this.http.get<any>(this.httpUrl +'/admin/user/getcurrentuser'+obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }

  // ===============MD

  async getuserforrolemapping(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/md/user/getuserforrolemapping' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getuserformodulerolemapping(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/md/user/getuserformodulerolemapping' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getuseridforhier(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/md/user/getuseridforhier' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async createMdRole(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/md/role/createrole', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async deleteRole(obj){
    const res = await this.http.put<any>(this.httpUrl + '/md/role/inactiverole',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updateRole(obj){
    const res = await this.http.put<any>(this.httpUrl + '/md/role/updaterole',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCurrentMdRole(obj){
    const resp = await this.http.get<any>(this.httpUrl +'/md/role/getcurrentroles'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createNewWorkflow(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/metadata/workflow/createNewWorkflow', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateNewWorkflow(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/metadata/workflow/updateNewWorkflow', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getWorkflows(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/workflow/getWorkflows' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getdistinctDocumentWorkflows(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/workflow/getdistinctDocumentWorkflows' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async getMdResource(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/resource/getcurrentresource' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getMdModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getmodules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async AllModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getAccountModules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getCurrentMdUser(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/user/getcurrentuser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async getAllUsersForAllModules(obj) {
  //   const resp = await this.http.get<any>(this.httpUrl + '/md/user/getAllUsersForAllModules' + obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  async createMdUser(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/md/user/createuser', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCurrentMdrole(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getcurrentroles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteUser_MD(obj){
    const res = await this.http.put<any>(this.httpUrl + '/md/user/inactiveuser',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getcurrentroleswithresources(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getroleswithresources' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }




  async insertroleprint(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/emb/info/role_print/insertroleprint' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getroleprint(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/emb/info/role_print/getroleprint'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateroleprint(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/emb/info/role_print/updateroleprint',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


    //header info
  
   
}


