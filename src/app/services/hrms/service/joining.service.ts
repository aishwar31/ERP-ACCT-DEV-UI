import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class JoiningService {
  httpUrl;

  employee_id;

  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl;
  }




  async insertEmployeeMasterData(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/hr/establishment_info/joining/addJoining3',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async addlogin(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/hr/establishment_info/joining/enableLogin',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  
  async removelogin(obj) {
    console.log(obj);
    
    const resp = await this.http.post<any>(this.httpUrl + '/hr/establishment_info/joining/removeLogin',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async updateestablish(obj) {
  //   console.log(obj);
    
  //   const resp = await this.http.post<any>(this.httpUrl + '/hr/establishment_info/joining/updateestablish',obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }


  async updateNodeCode(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/hr/establishment_info/joining/updateNodeCode',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getMaxEmployee(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl+'/hr/establishment_info/joining/getMaxEmployeeid' +b_acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }


  async  getEmployeeFunctionArea(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/hr/establishment_info/joining/getEmployeeFunctionArea' +obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }




}
