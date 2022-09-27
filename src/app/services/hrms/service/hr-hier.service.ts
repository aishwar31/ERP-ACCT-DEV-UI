import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class HrHierService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl ;
  }
  httpUrl2=this.main.httpUrl 

//API from Account Hier
  async deleteHierarchy(obj) {
    const resp = await this.http.put<any>(this.httpUrl2 + '/accounts/hierarchies/project/deleteHierarchy' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  projectupdateHierarchy(obj){
    const resp = this.http.put<any>(this.httpUrl2 + '/accounts/hierarchies/project/updateHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getprojectHierarchy(obj){
    const resp = this.http.post<any>(this.httpUrl2 + '/accounts/hierarchies/project/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  createHierarchy(obj){
    const resp = this.http.post<any>(this.httpUrl2 +'/accounts/hierarchies/project/createHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getCost(obj){
    const resp = await this.http.post<any>(this.httpUrl2 + '/accounts/costCenter/getCostCenter' , obj).toPromise().then(res => {
      return res
    });
    console.log(resp)
    return resp
  }
  // async insertEmbHierarchyNode(obj) {
  //   const resp = await this.http.post<any>(this.main.httpUrl + '/administration/embHier/insertEmbHierarchyNode' ,obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  // async getAllEmbHierarchy(obj) {
  //   const resp = await this.http.get<any>(this.main.httpUrl + '/administration/embHier/getAllEmbHierarchy' + obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
//API from Account Hier

  async getAllHrHierarchy(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/setting/hrHier/getAllHrHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async insertHrHierarchyNode(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/hr/setting/hrHier/insertHrHierarchyNode' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateHrHierarchyNode(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/hr/setting/hrHier/updateHrHierarchyNode' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteHrHierarchy(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/hr/setting/hrHier/deleteHrHierarchy' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }




  //data assign



  async getAllHrdataAssigned(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/setting/hrdataAssign/getAllHrdataAssigned' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertHrdataAssign(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/hr/setting/hrdataAssign/insertHrdataAssign' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateHrdataAssign(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/hr/setting/hrdataAssign/updateHrdataAssign' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getuserAssigneddata(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/setting/hrdataAssign/getuserAssigneddata'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
