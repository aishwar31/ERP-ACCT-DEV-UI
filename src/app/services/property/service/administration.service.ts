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
  async getAllPropHierarchy(obj) {
    console.log('called')
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getAllpropHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertPropHierarchyNode(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propHier/insertpropHierarchyNode' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updatePropHierarchyNode(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/propHier/updatepropHierarchyNode' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getuserAssigneddata(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propdataAssign/getuserAssigneddata' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getPropertyAssigneddata2(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propdataAssign/getAllpropdataAssigned' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertPropDataAssign(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propdataAssign/insertpropdataAssign' , obj).toPromise().then(res => {
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
