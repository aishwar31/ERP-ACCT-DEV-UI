import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  httpUrl;
  httpUrl1


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + "/property/dashboard";
    this.httpUrl1 = this.main.httpUrl
  }

  async getDashBoardCount(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getAllCount' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getSubSchemeInYears(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getSubSchemeInYears' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllotmentInYears(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getAllotmentInYears' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getProperties(obj) {
    const resp = await this.http.post(this.httpUrl1 + '/arr/getUniqueSku', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getserviceProperties(obj) {
    const resp = await this.http.post(this.httpUrl1 + '/arr/getAllArrBalance', obj).toPromise().then(res => {
      return res
    });
    return resp

  }
}
