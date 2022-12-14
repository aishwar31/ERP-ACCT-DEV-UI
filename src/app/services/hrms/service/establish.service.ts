import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class EstablishService {
  httpUrl;

  employee_id;
  complaint_detail;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl+"/hr";
  }
  //  all employee

  async  getAllArrangment(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/establishment/getAllArrangment' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  getEmployeeMasterData(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/establishment/getAllCurrentEstablishementInfo' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getEmployeePersonalInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/emp_info/empInfo/getPersonalInfo' + (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  //arrangment
  async addArrangment(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/updateAllEstablishmentInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async getCurrentEstablishementInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment/getCurrentEstablishementInfo'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getArrangmentSalComponent(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment/getArrangmentSalComponent'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getArrangmentAllSalComponent(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment/getArrangmentAllSalComponent'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async addVariablePayComp(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/establishment/addVariablePayComp',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addVariablePayComp1(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/establishment/updateVariablePayComp1',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

    //fix_salary
    async addFixedPayComponent(obj){
      const resp = await this.http.post<any>(this.httpUrl+'/payroll_info/fixedPay/addFixedPayComponent', (obj)).toPromise().then(res => {
        return res;
      });
      return resp;
    }
    async addFixedPay(obj){
      const resp = await this.http.post<any>(this.httpUrl+'/payroll_info/fixedPayAmount/addFixedPay', (obj)).toPromise().then(res => {
        return res;
      });
      return resp;
    }
   
    async getPartyFixedPay(obj) {
      const resp = await this.http.get<any>(this.main.httpUrl + '/hr/payroll_info/fixedPayAmount/ruleGetAllFixedPayForRule'+JSON.stringify(obj)).toPromise().then(res => {
        return res;
      });
     
      return resp;
    }

      //variable_salary
  async addVariablePay(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/payroll_info/variablePay/addVariablePay', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateVariablePayComp(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/establishment/updateVariablePayComp',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async deleteVariablePayComp(obj){
    const resp = await this.http.delete<any>(this.httpUrl+'/establishment/deleteVariablePayComp'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllVariablePay(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/payroll_info/variablePay/getVariablePay'+JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

    //noticePeriod
    async defineNoticePeriod(obj){
      const resp = await this.http.post<any>(this.httpUrl+'/establishment_info/noticePeriod/defineNoticePeriod',(obj)).toPromise().then(res => {
        return res;
      });
      return resp;
    }
   
    async getPartyNoticePeriod(obj) {
      const resp = await this.http.get<any>(this.httpUrl + '/establishment_info/noticePeriod/getPartyNoticePeriod'+JSON.stringify(obj)).toPromise().then(res => {
        return res;
      });
      return resp;
    }

     //leave 
  async defineLeaveForParty(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/leaveInfo/addLeaveInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async getLeavesOfParty(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment_info/leave/getAllEmpLeaves'+JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
//Probation
  async addPartyProbation(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment_info/probation/addPartyProbation', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async getPartyProbationInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment_info/probation/getPartyProbationInfo'+JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  //allDone 
  async addNewEstabishment(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/addEstablishment', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getFixPayStatus(obj){
    const resp = await this.http.get<any>(this.httpUrl+'/establishment/getFixPayStatus'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateStatusOfArrangement(obj){
    const resp = await this.http.put<any>(this.httpUrl+'/establishment/updateEstablishmentInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async getEstablishementInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment/getEstablishementInfo'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async getCurrentEstablishementOnDate(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/establishment/getCurrentEstablishementOnDate'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async insertEstablishmentInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/insertEstablishmentInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  updateAllEstablishmentInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/updateAllEstablishmentInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async  updateServiceInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/updateServiceInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  updateEstablishmentInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/updateEstablishmentInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  
  async  updateOrgInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl+'/establishment/updateOrgInfo', (obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  //salary Defination
  async getComponentDefinition(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl+'/hr/payroll_info/salaryComponents/getComponentDefinition'+JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getRuleInfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/establishment/getRuleInfo'+JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  //matrix
  async getMatrix(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/payroll_info/payMatrix/getPayMatrix'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getHRAMatrix(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/payroll_info/payMatrix/getHRAMatrix'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getGISMatrix(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/payroll_info/payMatrix/getGISMatrix'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getCCAMatrix(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/hr/payroll_info/payMatrix/getCCAMatrix'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  getAllRules(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl+'/hr/leaveRule/getAllRules'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getDate(){
    const resp = await this.http.get<any>(this.main.httpUrl+'/portal/getServerDate').toPromise().then(res => {
      return res;
    });
    return resp;
  }


}
