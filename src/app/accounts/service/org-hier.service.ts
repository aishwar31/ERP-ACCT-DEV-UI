import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class OrgHierService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl;
  }
  async  getOrgHier(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/accounts/orghier/getHier' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  addHier(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/accounts/orghier/addHier' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  updateorgHierstatus(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/accounts/orghier/updateorgHierstatus' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  updateOrgHier(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/accounts/orghier/updateOrgHier' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async  getHierarchy(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/accounts/hierarchies/org_hier_xref_levels/getHierarchy' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  createHierarchy(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/accounts/hierarchies/org_hier_xref_levels/createHierarchy' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  updateHierarchy(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/accounts/hierarchies/org_hier_xref_levels/updateHierarchy' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  moveOrganizationHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/org_hier_xref_levels/moveHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
  async  deleteHierarchy(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/accounts/hierarchies/org_hier_xref_levels/deleteHierarchy', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  //cost center

  async  getCost(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/accounts/costCenter/getCostCenter' , obj).toPromise().then(res => {
      return res
    });
    console.log(resp)
    return resp
  }


  //data assign

  async getAllAccountdataAssigned(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/account/setting/accountdataAssign/getAllAccountdataAssigned' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertAccountdataAssign(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/account/setting/accountdataAssign/insertAccountdataAssign' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateAccountdataAssign(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/account/setting/accountdataAssign/updateAccountdataAssign' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getuseerAssigneddata(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/account/setting/accountdataAssign/getuseerAssigneddata'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
