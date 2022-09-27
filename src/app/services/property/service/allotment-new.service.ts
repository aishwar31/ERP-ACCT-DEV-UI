import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class AllotmentNewService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async getactiveallotlist(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ev/getRegistrationList',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async searchRegistrationList(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ev/getRegistrationList',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async getInstallmentdetails(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/re/ev/instl',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async finaladdAllotment(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/re/ev/alt',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async getinstallforview(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ev/getRegistrationList',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async searchonlyreg(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ev/getListforALT',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async getarrstatus(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ar/getar',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async putarr(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/ar/updatear',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

}
