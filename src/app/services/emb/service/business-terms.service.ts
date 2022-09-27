import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class BusinessTermsService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/fields';
  }


//business Term(Shubham)
  async getAllBusinessTerms(pg_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/data_dictionary/terms/getAllTerms' + pg_id).toPromise().then(res => {
      return res;
    });
    return resp;
  } 

  async getLogicalFields(){
    const resp = await this.http.get<any>(this.main.httpUrl + '/systemData/getLogicalFields').toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteBusinessTerms(obj){
    const resp = await this.http.delete<any>(this.main.httpUrl + '/administration/data_dictionary/terms/deleteTerm'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async addBusinessTerms(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/data_dictionary/terms/createTerm',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateBusinessTerms(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/data_dictionary/terms/updateField',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async getSystemCodeValue() {
    const resp = await this.http.get<any>(this.main.httpUrl + '/systemData/getSystemCodeValue').toPromise().then(res => {
      return res;
    });
    return resp;
  }


  //code value(Hadi)
  async getCodeValue(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/reference/code_value/getCodeValues' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async  getFieldCodeValues(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getFieldCodeValues' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async insertCodeValue(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/reference/code_value/createCodeValue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateCodeValues(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/reference/code_value/updateCodeValue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteCodeValue(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/administration/reference/code_value/deletecodevalue' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
