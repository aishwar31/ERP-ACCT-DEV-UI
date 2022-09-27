import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service'
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private MainService:MainService,private http:HttpClient) { }
  httpUrl = this.MainService.httpUrl
  async updateRole(obj){
    const res = await this.http.put<any>(this.httpUrl + '/md/role/updaterole',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  // async deleteRole(obj){
  //   const resp = await this.http.delete<any>(this.httpUrl +'/md/role/inactiverole'+JSON.stringify(obj)).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  async deleteRole(obj){
    const res = await this.http.put<any>(this.httpUrl + '/md/role/inactiverole',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async createMdRole(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/md/role/createrole', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getMdResource(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/resource/getcurrentresource' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getMdModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getmodules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async AllModules(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/admin/resource/getAccountModules' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getCurrentMdrole(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getcurrentroles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getcurrentroleswithresources(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/role/getroleswithresources' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
