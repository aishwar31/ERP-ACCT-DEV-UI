import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class MasterDataService {


  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }


  //upload document
 
  async viewDoc(obj) {

    const resp = await this.http.post(this.main.httpUrl + '/info/upload/viewDoc', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
  }
}
  async getDocInfo(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/upload/getDocInfo' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }


  //code Value
  async addparty(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/party/addparty', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async addpartymd(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/metadata/party/addparty', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getAllparties(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/metadata/party/getAllparties' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;

  }async getAllrepresentative(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/metadata/party/getAllrepresentative' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getrepresentative(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/metadata/party/getrepresentative' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getparty(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/metadata/party/getAllparties' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async deleteparty(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl2 + '/metadata/party/deleteparty' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updateparty(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/party/updateparty', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updatepartymd(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl2 + '/metadata/party/updateparty', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  //arr
  async getarr(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/arr/getarr' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async addarr(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/arr/addarr', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async deletearr(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/arr/deletearr' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updatearr(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/arr/updatearr', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  // async getCodeValue(obj) {
  //   const res = await this.http.get<any>(this.main.httpUrl + '/md/codeValue/getCodeValues' + obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return res;
  // }
  // async getCodeValue(b_acct_id){
  //   const resp = await this.http.get<any>(this.main.httpUrl + '/metadata/codeValue/getCodeValues'+b_acct_id).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  //project

  async getProjectInfo(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/info/project/getProjectInfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async createProjectInfo(obj) {
    const res = await this.http.post<any>(this.main.httpUrl + '/info/project/createProjectInfo', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async deleteProjectInfo(obj) {
    const res = await this.http.delete<any>(this.main.httpUrl + '/info/project/deleteProjectInfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updateProjectInfo(obj) {
    const res = await this.http.put<any>(this.main.httpUrl + '/info/project/updateProjectInfo', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }



  //work
  async updateProjectcode(obj) {
    const res = await this.http.put<any>(this.main.httpUrl + '/info/work/updateProjectcode', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  
  async getWorkInfo(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/info/work/getWorkInfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getusersForsanctioned(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/info/work/getusersForsanctioned' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async createWorkInfo(obj) {
    const res = await this.http.post<any>(this.main.httpUrl + '/info/work/createWorkInfo', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async addModulesHierarchy(obj) {
    const res = await this.http.post<any>(this.main.httpUrl2 + '/accounts/hierarchy/addModulesHierarchy', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async deleteWorkInfo(obj) {
    const res = await this.http.delete<any>(this.main.httpUrl + '/info/work/deleteWorkInfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updateWorkInfo(obj) {
    const res = await this.http.put<any>(this.main.httpUrl + '/info/work/updateWorkInfo', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updateModulesHierarchy(obj) {
    const res = await this.http.put<any>(this.main.httpUrl2 + '/accounts/hierarchy/updateModulesHierarchy', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updateworkeventcode(obj) {
    const res = await this.http.put<any>(this.main.httpUrl + '/info/work/updateworkeventcode', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
}
