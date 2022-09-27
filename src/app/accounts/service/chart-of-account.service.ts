import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})

export class ChartOfAccountService {
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl+"/accounts/chartofaccount";
  }
  async  getchartofaccount(obj){
    const resp = this.http.get<any>(this.httpUrl + '/getchartofaccount' + JSON.stringify(obj)).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  createchartofaccount(obj){
    const resp = this.http.post<any>(this.httpUrl + '/createchartofaccount' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
  async  deleteChartOfAccount(obj){
    const resp = this.http.delete<any>(this.httpUrl + '/deleteChartOfAccount' +obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }

  async deletechartofaccount(obj){
    const resp = this.http.delete<any>(this.httpUrl + '/deletechartofaccount' + JSON.stringify(obj)).toPromise().then(res => {
      return res
    });
    return resp
  }

  async  moveChartOfAccountHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/coa/moveHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  updatechartofaccount(obj) {
    const resp = await this.http.put<any>(this.httpUrl+'/updatechartofaccount',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  ////////////******Chart of Account start*********/
  async  createChartOfAccountHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/coa/createHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }

  async  getChartOfAccountHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/coa/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteChartOfAccountHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/coa/deleteHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async updateChartOfAccountHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/coa/updateHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  ////////////******Chart of Account end*********/

}
