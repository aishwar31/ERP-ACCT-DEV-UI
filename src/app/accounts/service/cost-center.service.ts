
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})

export class CostCenterService {
  
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl;
  }

  async  getEmployees(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/md/user/getEmpPartyInfo' + obj).toPromise().then(res => {
      return res
    });
    console.log(resp)
    return resp
  }
async  getCost(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/accounts/costCenter/getCostCenter' , obj).toPromise().then(res => {
    return res
  });
  console.log(resp)
  return resp
}
async  updateCost(obj) {
  const resp = await this.http.put<any>(this.httpUrl + '/accounts/costCenter/updateCostCenter' , obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
async  deleteCost(obj) {
  const resp = await this.http.put<any>(this.httpUrl + '/accounts/costCenter/deleteCostCenter' , obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
async  createCost(obj) {
  const resp = await this.http.post<any>(this.httpUrl + '/accounts/costCenter/createCostCenter' , obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
}