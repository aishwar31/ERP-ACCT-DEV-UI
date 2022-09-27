import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';


@Injectable({
  providedIn: 'root'
})
export class DashService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }

  async getallebill(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getallebill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async getworklist(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getworklist' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getWorkComp(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getworkcomp' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getembapprovaldays(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getembapprovaldays' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getemdmeasurementtoapprovaldays(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getemdmeasurementtoapprovaldays' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getebillmeasurementtoapprovaldays(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getebillmeasurementtoapprovaldays' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getfinancialexpencebywork(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getfinancialexpencebywork' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getFinancialExpence(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getfinancialexpence' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getembexpencebywork(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getbyworkembexpence' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getboqamount(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getboqamount' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getembexpence(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getembexpence' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getebillexpencebywork(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getbyworkebillexpence' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getebillexpence(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getebillexpence' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getAllApprovedEMB(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getallapprovedemb' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getAllApprovedEBILL(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getallapprovedebill' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getLateWorkAmt(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getamtlatework' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getdevamt(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getdevamt' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async get_late_work(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getlatework' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

 async getebillapprovaldays(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getebillapprovaldays' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getperformancebyuser(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dashboard/getperformancebyuser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

}