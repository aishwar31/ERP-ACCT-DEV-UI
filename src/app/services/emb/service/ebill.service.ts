import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class EbillService {


  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    
    this.httpUrl = this.main.httpUrl ;
  }
  // async getPartRate(obj) {
  //   const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getPartRateData' + obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;

  // }


  async getquantityofprevbill(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getquantityofprevbill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getmasterdeduction(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl + '/info/masterdeduction/getmasterdeduction'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  
  async getlastbillrate(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getlastbillrate' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getdevemb(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getdevemb' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async getPrevRate(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getPrevRate' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }


  async deletePrevRate(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/ebill/deletePrevRate' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async insertPrevRate(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/ebill/insertPrevRate' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updatePrevRate(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/ebill/updatePrevRate' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getBoq(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/boq/getBoq' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getBill(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getbill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async systemDate() {
    const resp = await this.http.get<any>(this.main.httpUrl + '/systemData/getsystemdate').toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updateebillStatus(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/ebill/updateebillstatus' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updatededuction(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/ebill/updatededuction' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getHeadRecord(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getheadDetails'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async updateDeduction(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/ebill/updateDeduction' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getded(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/deduction/getded' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getALLDed(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getdeduction' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  
  async getBillsOfWork(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getebill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getLastBill(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getLastBill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getgenemb(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/emb/getgenemb' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getPartRate(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getPartRateData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async deleteebill(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/ebill/deleteebill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updateebill(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/ebill/updateebill' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async createebill(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/ebill/createebill' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  } async updateGlobalBillID(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/ebill/updateGlobalBillNo', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async addactivity(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/work/addactivity', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async getWorkBudInfo(obj){
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getWorkBudInfo'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async sendEbillToAccount(obj){
    const resp = await this.http.post<any>('http://180.233.122.171:8080/ICICI/models' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


}
