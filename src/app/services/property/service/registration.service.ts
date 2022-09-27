import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async getAllParties(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ip/getip',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllProperties(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ri/getri',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async postparty(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ip/addip',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async putparty(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/ip/updateip',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async postproperty(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ri/addri',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async deleteIP(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/ip/deleteip',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async deletearr(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/ar/deletear',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getactivereglist(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ev/getRegistrationList',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async postArrangement(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ar/addar',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async finaladdRegistration(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/re/ev/reg',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  


}
