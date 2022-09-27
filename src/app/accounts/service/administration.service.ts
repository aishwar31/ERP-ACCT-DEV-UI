import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  httpUrl;

  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl;
  }
  async getAllHrHierarchy(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/account/settings/accounthier/getAllAccountHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //
 
 
  async insertHrHierarchyNode(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/account/settings/accounthier/insertAccountHierarchyNode' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateHrHierarchyNode(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/account/settings/accounthier/updateAccountHierarchyNode' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //data assignemnt
  async getAllHrdataAssigned(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/account/setting/accountdataAssign/getAllAccountdataAssigned' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllPropdataAssigned(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propdataAssign/getAllpropdataAssigned' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllHrModuleUsers(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/md/user/getuseridforhier' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertHrdataAssign(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/account/setting/accountdataAssign/insertAccountdataAssign' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertPropdataAssign(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propdataAssign/accountdataAssign/insertpropdataAssign' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateHrdataAssign(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/account/setting/accountdataAssign/updateAccountdataAssign' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updatePropdataAssign(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/propdataAssign/updatepropdataAssign' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  
}
