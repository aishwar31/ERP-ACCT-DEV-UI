import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class CbService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }

  async getAllCB(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/cb/getgenericcb'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createCB(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/cb/addgenericcb',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateCB(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/cb/updategenericcb',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updatecbstatus(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/cb/updatecbstatus',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteCB(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/cb/deletegenericcb'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
