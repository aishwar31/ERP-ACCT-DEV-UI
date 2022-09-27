import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class AllEmpService {

  httpUrl;

  employee_id;

  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl+"/hr";
  }



  //Account APIS;
  async  getAccountProjectHier(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/getHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp;
  }

  async  createAccountproject(obj){
    const resp = this.http.post<any>(this.main.httpUrl+ '/accounts/hierarchies/project/createHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp;
  }

  async  projectupdateHierarchy(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/accounts/hierarchies/project/updateHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async  moveHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/moveHierarchy',obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async  getCostCenter(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/costCenter/getCostCenter',obj).toPromise().then(res => {
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

  async  getBudgetHierarchy(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/getHierarchy',obj).toPromise().then(res => {
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

  //Account APIS;

  async  getPayComponent(obj) {
    
    const resp = await this.http.get<any>(this.main.httpUrl+'/hr/setting/getPayComponent' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  updatePayComponent(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/hr/setting/updatePayComponent',obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  

  
 
  async  getAllBugdet(obj){
    const resp = this.http.get<any>(this.main.httpUrl + '/hr/setting/getAllBugdet'+JSON.stringify(obj)).toPromise().then(res => {
      return res
    });
    return resp
  }

 
  
  async  getAllProduct(obj){
    const resp = this.http.get<any>(this.main.httpUrl + '/hr/setting/getAllProduct'+JSON.stringify(obj)).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  insertBudgetInfo(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/hr/setting/insertBudgetInfo',obj).toPromise().then(res => {
      return res
    });

    return resp
  }
  async  insertProductInfo(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/hr/setting/insertProductInfo',obj).toPromise().then(res => {
      return res
    });

    return resp
  }
  

  //budget info and product info
  
  //hr
  async updateEmployeeId(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/empInfo/updateEmployeeId', (obj)).toPromise().then(res => {
    return res;
    });
    return resp;
    }
  async  getEmployeeMasterData(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/empInfo/getAllListOfEmployee' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getEmployeeEstablishMasterData(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/empInfo/getAllListOfEmployeeestablish' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updatedob(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/empInfo/updatedob', (obj)).toPromise().then(res => {
    return res;
    });
    return resp;
    }
  async  getAllPartyFields(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/empInfo/getAllListOfEmployee' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  deleteEmployee(obj) {
    const resp = await this.http.delete<any>(this.httpUrl+'/emp_info/empInfo/deleteEmployee' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  inActiveEmployee(obj) {
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/empInfo/inActiveEmployee' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  activeEmployee(obj) {
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/empInfo/activeEmployee' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async addEmployeePersonalInfo(obj){
  //   const resp = await this.http.post<any>(this.httpUrl+'/party/personal/addPersonalInfo', (obj)).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  async updatePersonalInfo(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/empInfo/updateEmployeePersonalInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getUploadedFiles(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/establishment_info/uploadfile/getUploadedFiles' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getUploadedFileData(obj) {
    const resp = await this.http.post(this.httpUrl+'/establishment_info/uploadfile/getUploadedFileData', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
  }
  }
  async getPersonalInfo(obj){
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/empInfo/getPersonalInfo' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //Qualification Services
  async  getQualifications(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/education/getQualifications' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addQualification(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/emp_info/education/addQualification', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateQualifications(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/education/updateQualification', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteQualification(obj){
    const resp = await this.http.delete<any>(this.httpUrl+'/emp_info/education/deleteQualification' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  //Nominee Services
  async  getNominee(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/nominee/getNominee' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addNominee(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/emp_info/nominee/addNominee', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateNominee(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/nominee/updateNominee', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteNominee(obj){
    const resp = await this.http.delete<any>(this.httpUrl+'/emp_info/nominee/deleteNominee' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //bank account info
  async getBankAcctInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/emp_info/bankAccount/getPartyBankAccount' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addBankAcctInfo(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/hr/emp_info/bankAccount/addBankAccount', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateBankAcctInfo(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/emp_info/bankAccount/updateBankAccount', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async deleteBankAcctInfo(obj){
  const resp = await this.http.delete<any>(this.httpUrl + '/emp_info/bankAccount/deleteBankAccount'+ JSON.stringify(obj)).toPromise().then(res => {
    return res;
  });
  }
  async  getDependentInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/dependent/getDependents' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addDependentInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/emp_info/dependent/addDependent', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateDependentInfo(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/emp_info/dependent/updateDependent', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteDependentInfo(obj){
    const resp = await this.http.delete<any>(this.httpUrl+'/emp_info/dependent/deleteDependent' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //lic
  async getLicInfo(obj){
  
    const res = await this.http.get<any>(this.main.httpUrl + '/hr/emp_info/lic/getLicInfo'+obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updateLicInfo(obj){
  
    const res = await this.http.put<any>(this.main.httpUrl + '/hr/emp_info/lic/updateLicInfo',obj).toPromise().then(res => {
      return res;

    });
    return res;

  }

  async addLicInfo(obj){
  
    const res = await this.http.post<any>(this.main.httpUrl + '/hr/emp_info/lic/addLicInfo',obj).toPromise().then(res => {
      return res;

    });
    return res;

  }

  async deleteLicInfo(obj){
  
    const res = await this.http.delete<any>(this.main.httpUrl + '/hr/emp_info/lic/deleteLicInfo'+obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getpersonalall(obj){
    console.log("welcome")
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/empInfo/getpersonalall' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

}
