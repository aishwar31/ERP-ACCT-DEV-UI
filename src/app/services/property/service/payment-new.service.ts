import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentNewService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async getdistinctArrangement(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/ev/getDistinctar',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async finaladdpayment(obj){
    console.log(obj)
    const resp = await this.http.post<any>(this.httpUrl + '/re/ev/pmt',obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async getPaymentDetails(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/property/properties/getPaymentDetails' + obj).toPromise().then(res => {
      return res;
    });
    return resp
  }

  async getMultipleEventForModule(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/account/event/getMultipleEventForModule', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  
  }

  async createEvent(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/accounts/eventgroup/addEventGroup', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
}
