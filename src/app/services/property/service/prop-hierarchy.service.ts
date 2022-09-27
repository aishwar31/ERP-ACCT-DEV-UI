import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class PropHierarchyService {
  httpUrl;


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + "/property/dashboard";
  }
  async  getBudgetHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getproductHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/product/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getActivityHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/activity/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  projectupdateHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/project/updateHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
 
  async getDashBoardCount(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getAllCount' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getprojectHierarchy(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getprojectcreateHierarchy(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/createHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getprojectcreateHierarchyMultiple(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/addMultipleHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getCost(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/accounts/costCenter/getCostCenter', obj).toPromise().then(res => {
      return res
    });
    console.log(resp)
    return resp
  }
  async view_Doc(obj) {
    const resp = await this.http.post(this.main.httpUrl + '/property/location/getlocationImage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res
    });
    return resp
  }
  async createHierarchy(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propHier/insertpropHierarchyNode', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertSyncWithAccountHierToProp(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propHier/insertHierarchySyncWithProjectHier', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getHierarchyData(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getAllpropHierarchies' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getHierarchyWithLocationInfo(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getHierarchyWithLocationInfo' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllpropHierarchynodes(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getAllpropHierarchynodes' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async nextIdToInsert(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getNextAutoIncrementIdForHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getHierarchynodes(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getpropHierarchynodes' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteHierarchyNode(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/deletepropHierarchyNode', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updateHierarchy(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/updatepropHierarchyNode', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async deleteHierarchy(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/deletepropHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  // async deleteHierarchy(obj) {
  //   const resp = await this.http.delete<any>(this.main.httpUrl + '/property/propHier/updatepropHierarchyNode' + obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  //////////////////////////standered Hierarchy API
  async getAllRegularHierarchies(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/RegularlHier/getAllRegularHierarchies' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getRegularHierarchyNodes(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/RegularlHier/getRegularHierarchyNodes' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertRegularHierarchyNode(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/RegularlHier/insertRegularHierarchyNode', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteRegularHierarchyNode(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/RegularlHier/deleteRegularHierarchyNode', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updatepropHierarchyNode(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/RegularlHier/updatepropHierarchyNode', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteRegularHierarchy(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/RegularlHier/deleteRegularHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  // letest changes
  async createLocationHierarchy(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propHier/addLocationHier', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getLocationHierarchy(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getAllLocationHier' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async update_Location_hier(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/updateLocationHeir', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async createLocationHierarchyNodes(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/propHier/createHierarchy', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllHierNodes(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/propHier/getHierarchy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async update_Location_hier_nodes(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/updateHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteLocationHierarchyNodes(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/deleteHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteLocationHierarchy(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propHier/deletepropHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
}
