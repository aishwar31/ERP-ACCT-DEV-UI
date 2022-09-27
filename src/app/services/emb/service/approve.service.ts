import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ApproveService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/profile';
  }

  async getDataForCertificate(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/appr/getDataForCertificate' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }


   
async getundertakings(obj) {
  const res = await this.http.get<any>(this.main.httpUrl + '/administration/undertakings/undertakingsbyRoleDoc' + obj).toPromise().then(res => {
    return res;
  });
  return res;
}

  async getPendingApprbydoclocalno(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/appr/getPendingApprbydoclocalno'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async rejectAppr(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/appr/rejectAppr', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getWorkTenderId(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/appr/getWorkTenderId' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getDocInfo(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/info/upload/getDocInfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async viewDoc(obj) {

    const resp = await this.http.post(this.main.httpUrl + '/info/upload/viewDoc', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
  }
}
  // async viewDoc(obj) {
  //   const res = await this.http.post<any>(this.main.httpUrl + '/info/upload/viewDoc' , obj, { responseType: 'blob' }).toPromise().then(res => {
  //     return res;
  //   });
  //   return res;
  // }

  async getWorkInfo(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/info/work/getWorkFromTender' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async insertForAppr(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/appr/insertForAppr', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateappr(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/appr/updateappr', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getApprbyuserid(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/appr/getApprbyuserid'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getApprbydoclocalno(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/appr/getApprbydoclocalno'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getApprovalHier(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/approve/getApprovalHier' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getApprovalStatus(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/approve/getApprovalStatus' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async approveTask(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/approve/approveTask', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async rejectTask(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/approve/rejectTask', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async insertForApproval(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/approve/insertForApproval', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getStatus(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/approve/getStatus'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async changestatusINTENDER(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/boq/changestatus', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async changestatusINEMB(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/emb/changestatus', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getWorkBudInfo(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getWorkBudInfo'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async changestatusINEBILL(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/ebill/updateebillstatus', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}