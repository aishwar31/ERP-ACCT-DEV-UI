import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl+"/accounts/hierarchy";
  }
  async  getHierarchy(obj){
    const resp = this.http.get<any>(this.httpUrl + '/getHierarchy' + JSON.stringify(obj)).toPromise().then(res => {
      return res
    });
    return resp
  }
  
  async  createHierarchy(obj){
    const resp = this.http.post<any>(this.httpUrl + '/createHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
 
  async deleteHierarchy(obj){
    const resp = this.http.delete<any>(this.httpUrl + '/deleteHierarchy' + JSON.stringify(obj)).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  updateHierarchy(obj) {
    const resp = await this.http.put<any>(this.httpUrl+'/updateHierarchy',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }



  
  ////////////******Project start */
  async  createProjectHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/createHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }

  async  getProjectHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteProjectHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/project/deleteHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updateProjectHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/project/updateHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updateHierarchyModule(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/project/updateHierarchyModule' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }


  ////////////******Project end*********/


  ////////////******Activitystart**********/
  async  createActivityHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/activity/createHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
  async  moveActivityHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/activity/moveHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
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
  async deleteActivityHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/activity/deleteHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }                                                                                                                    

  async updateActivityHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/activity/updateHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  ////////////******Activity end*********/



  ////////////******Product start*********/
  async  createProductHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/product/createHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
  async  moveProductHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/product/moveHierarchy' ,obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
  async  getProductHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/product/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteProductHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/product/deleteHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async updateProductHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/product/updateHierarchy' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  ////////////******Product end*********/

    
async  createBudgetHierarchy(obj){
  const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/createHierarchy' ,obj).toPromise().then(res => {
    console.log(res)
    return res
  });
  return resp
}

async  getBudgetHierarchy(obj){
  const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/getHierarchy',obj).toPromise().then(res => {
    return res
  });
  return resp
}
async  getBudgetHierarchyWithAllocation(obj){
  const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/getHierarchyWithAllocation',obj).toPromise().then(res => {
    return res
  });
  return resp
}
async deleteBudgetHierarchy(obj){
  const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/budget/deleteHierarchy' ,obj).toPromise().then(res => {
    return res
  });
  return resp
}

async  moveBudgetHierarchy(obj){
  const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/moveHierarchy' ,obj).toPromise().then(res => {
    console.log(res)
    return res
  });
  return resp
}

async  updateBudgetHierarchy(obj){
  const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/budget/updateHierarchy' ,obj).toPromise().then(res => {
    return res
  });
  return resp
}

async updateBudgetAmount(obj){
  const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/budget/updateHierarchyAmount' ,obj).toPromise().then(res => {
    return res
  });
  return resp
}
}