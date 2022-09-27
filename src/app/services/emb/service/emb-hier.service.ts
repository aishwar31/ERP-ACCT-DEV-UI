import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class EmbHierService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl ;
  }


  
  async getAllEmbHierarchy(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/embHier/getAllEmbHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllPropHierarchy(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getAllpropHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertEmbHierarchyNode(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/embHier/insertEmbHierarchyNode' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateEmbHierarchyNode(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/embHier/updateEmbHierarchyNode' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteEMB_Hierarchy(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl2 + '/accounts/hierarchies/project/deleteHierarchy' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getCost(obj){
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/accounts/costCenter/getCostCenter' , obj).toPromise().then(res => {
      return res
    });
    console.log(resp)
    return resp
  }
  async  getBudgetHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl2 + '/accounts/hierarchies/budget/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getactHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl2 + '/accounts/hierarchies/activity/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  projectupdateHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl2 + '/accounts/hierarchies/project/updateHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getprojectcreateHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl2 +'/accounts/hierarchies/project/createHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getprojectHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl2 + '/accounts/hierarchies/project/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getproductHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl2 + '/accounts/hierarchies/product/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }


  //data assign



  async getAllEmbdataAssigned(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/embdataAssign/getAllEmbdataAssigned' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertEmbdataAssign(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/embdataAssign/insertEmbdataAssign' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateEmbdataAssign(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/embdataAssign/updateEmbdataAssign' ,obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getuserAssigneddata(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/embdataAssign/getuserAssigneddata'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
