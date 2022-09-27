import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class GatewayMidConfigService {
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl+"/accounts/gatewayConfigure";
  }
  
  async getGatewayConfigureData(obj){
    const res = await this.http.get<any>(this.httpUrl + '/getGatewayConfigureData'+obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getEnableAccountDataBYGateway(obj){
    const res = await this.http.get<any>(this.httpUrl + '/getEnableAccount'+obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async createGatewayConfigure(obj){
    const res = await this.http.post<any>(this.httpUrl + '/createGatewayConfigure',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updateGatewayConfigure(obj){
    const res = await this.http.put<any>(this.httpUrl + '/updateGatewayConfigure',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async inactiveGatewayConfigure(obj){
    const res = await this.http.put<any>(this.httpUrl + '/inactiveGatewayConfigure',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

}
