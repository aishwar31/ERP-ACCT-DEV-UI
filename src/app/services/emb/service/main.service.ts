import { HttpClient, HttpEventType } from '@angular/common/http';

import { AuthenticationService } from '../../../authentication.service'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MainService {
  
  // httpUrl = 'http://preprod.upda.co.in:3010';
  // httpUrl = 'https://erp.upda.co.in:3001';
  httpUrl = this.auth.httpUrl+"/emb";
  httpUrl2 =  this.auth.httpUrl;
  version = "(UAT)31-03-2021";
  zone;
  constructor(private http: HttpClient, public auth: AuthenticationService) { }
  profileImageUrl;
  accountImageUrl;
  userprofileImageUrl;
  codeValueShowObj = {};
  codeValueTechObj = {};
  accountInfo = {};
  userInfo = {};
  taskcount = 0;
  allAssignedComponent;
  componentCode;
  eBillUser = { role_cd: '' };
  roleCodeToRoleDescription = {};
  ObjRoleCodeTOAccess = {};
count = 0
  trunc(number) {
    return (Math.trunc(number * 1000)) / 1000
  }

  toFixed(number) {
    return Number(number.toFixed(2))
  }

  dateformatchange(date) {
    if (date == undefined || date == null) {
      return "";
    }
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-");
    return datearr[2] + '/' + datearr[1] + '/' + datearr[0]
  }

  allLanguage = []
  language_cd
  async getAllLanguage() {
    var obj = new Object();
    var resp = await this.getAllLanguages(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.allLanguage = resp.data;
      this.language_cd = this.auth.language_cd
    } else {

    }
  }
  allLableShowObj = {}
  allLabel = []
  async getAllLabel() {
    var obj = new Object();
    //obj['module_cd'] = 'MD'
    var resp = await this.getcomponentLabelvalueswithLanguage(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.allLabel = resp.data;

      var obj = new Object();
      for (let i = 0; i < resp.data.length; i++) {
        obj[resp.data[i]['language_cd'] + resp.data[i]['component_cd'] + resp.data[i]['label_no']] = resp.data[i]['value_to_show'];
      }

      console.log(obj)

      this.allLableShowObj = obj;

    } else {

    }
  }
  async getcomponentLabelvalueswithLanguage(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/systemdata/languages/getcomponentLabelvalueswithLanguage' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getAllLanguages(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/systemdata/languages/getAllLanguages' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getWorkflows(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/metadata/workflow/getWorkflows' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getUsersForModuleWorkflow(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/metadata/workflow/getUsersForModuleWorkflow' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async insertTask(obj) {
    const res = await this.http.post<any>(this.httpUrl2 + '/metadata/workflowlog/insertTask', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getWorkflowlog(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/metadata/workflowlog/getWorkflowlog' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getAllTaskOfUser(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/metadata/workflowlog/getAllTaskOfUser' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getundertakingsWithWorkflow(obj) {
    const res = await this.http.get<any>(this.httpUrl2 + '/metadata/undertakings/getundertakingWithWorkflow' + obj).toPromise().then(res => {
      return res;
    })
    return res;
  }
  async getcurrentroleswithresources(obj) {
    const resp = await this.http.get<any>(this.httpUrl2 + '/md/role/getroleswithresources' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createLegalEntity(obj) {
    const res = await this.http.post<any>(this.httpUrl2 + '/systemdata/legalentity/createindentity', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getcurrentlegalentity(obj) {
    const resp = await this.http.get<any>(this.httpUrl2 + '/systemdata/legalentity/getcurrentlegalentity' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async sendMsg(mobile, message) {
    //console.log(otp + "@123")
    var str = "https://2factor.in/API/R1/?module=TRANS_SMS&apikey=f5b33455-838a-11ea-9fa5-0200cd936042&to="+ mobile +"&from=EMBINF&templatename=EMB+Approval&var1="+ message
   // var str = "https://2factor.in/API/V1/f5b33455-838a-11ea-9fa5-0200cd936042/SMS/" + mobile + "/" + otp + "/ERPUPDA"
    const resp = this.http.get<any>(str).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertroleprint(obj) {
    const resp = await this.http.post<any>(this.httpUrl2 + '/emb/info/role_print/insertroleprint' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getroleprint(obj) {
    const resp = await this.http.get<any>(this.httpUrl2 + '/emb/info/role_print/getroleprint'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateroleprint(obj) {
    const resp = await this.http.put<any>(this.httpUrl2 + '/emb/info/role_print/updateroleprint',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
