import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { AuthenticationService } from '../../authentication.service'
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient, public auth: AuthenticationService) { }
  profileImageUrl;
  codeValueTechObj = {};
  codeValueShowObj = {}
  // httpUrl="http://localhost:3001";
  //httpUrl="http://cm.svayamtech.com:3000";
  // httpUrl="https://vdaerp.svayamtech.com:3002";
  httpUrl = this.auth.httpUrl;
  //httpUrl="http://139.59.61.84:3000";
  accountImageUrl;
  accInfo = {};
  dateFormatChange(date) {
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-")
    return datearr[2] + '/' + datearr[1] + '/' + datearr[0]
  }
  allLanguage = []
  language_cd
  async getAllLanguage() {
    var obj = new Object();
    var resp = await this.getAllLanguages(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.allLanguage = resp.data;
      this.language_cd = this.auth.language_cd
    } else {

    }
  }
  count = 0
  allLableShowObj = {}
  allLabel = []
  async getAllLabel() {
    var obj = new Object();
    //obj['module_cd'] = 'MD'
    var resp = await this.getcomponentLabelvalueswithLanguage(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.allLabel = resp.data;

      var obj = new Object();
      for (let i = 0; i < resp.data.length; i++) {
        obj[resp.data[i]['language_cd'] + resp.data[i]['component_cd'] + resp.data[i]['label_no']] = resp.data[i]['value_to_show'];
      }

      console.log(obj)

      this.allLableShowObj = obj;

    } else {

    }
  }
  async getcomponentLabelvalueswithLanguage(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getcomponentLabelvalueswithLanguage' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getAllLanguages(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getAllLanguages' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getFields(obj) {

    const res = await this.http.get<any>(this.httpUrl + '/metadata/fields/getfields' + obj).toPromise().then(res => {
      return res;

    });
    return res;

  }
  async getAllTaskOfUser(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/workflowlog/getAllTaskOfUser' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getSystemDate() {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/sysAttribute/getSystemDate').toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCodeValue(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/codeValue/getCodeValues' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  public exportAsExcelFile(json: any[], json1: any[], excelFileName: string): void {
    const worksheet1: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(json);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(json1);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet2': worksheet2, 'Sheet1': worksheet1 }, SheetNames: ['Sheet1', 'Sheet2'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

