import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService } from './main.service'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,private MainService:MainService) { }
  httpUrl = this.MainService.httpUrl
  async getCurrentMdUser(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/user/getcurrentuser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async get_Emp_id_to_user_id(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/user/getEmpIdUserId' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteUser(obj){
    const resp = await this.http.delete<any>(this.httpUrl +'/md/user/getEmpIdUserId'+JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createMdUser(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/md/user/createuser', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async deleteUser_MD(obj){
    const res = await this.http.put<any>(this.httpUrl + '/md/user/inactiveuser',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCurrentLegalEntity(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getcurrentlegalentity' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
