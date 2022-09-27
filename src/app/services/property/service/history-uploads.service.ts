import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryUploadsService {
  httpUrl: string;

  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
}
async InsertAllhistoryUploadsData(requestObject) {
  const resp = this.http.post<any>(this.main.httpUrl + '/ri/historyUploads/insert' , requestObject).toPromise().then(res => {
    return res
  });
  return resp
}
async InsertAllhistoryUploadscsv(params,requestObject) {
  const resp = this.http.post<any>(this.main.httpUrl + '/ri/historyUploads/fileupload'+params , requestObject).toPromise().then(res => {
    return res
  });
  return resp
}
async getAllhistoryUploadsData() {
  const resp = this.http.get<any>(this.main.httpUrl + '/ri/historyUploads/get' ).toPromise().then(res => {
    return res
  });
  return resp
}
async putHistoryUploadsData(requestObject) {
  const resp = this.http.put<any>(this.main.httpUrl + '/ri/historyUploads/Approve', requestObject).toPromise().then(res => {
    return res
  });
  return resp
}
async processHistoryUploadsData(requestObject) {
  const resp = this.http.put<any>(this.main.httpUrl + '/ri/historyUploads/process', requestObject).toPromise().then(res => {
    return res
  });
  return resp
}
async deleteHistoryUploadsData(requestObject) {
  console.log(requestObject);
  
  const resp = this.http.delete<any>(this.main.httpUrl + '/ri/historyUploads/delete'+ JSON.stringify(requestObject) ).toPromise().then(res => {
    return res
  });
  return resp
}

async postAllhistoryUploadsData(route,requestObject) {
  const resp = this.http.post<any>(this.main.httpUrl + route , requestObject).toPromise().then(res => {
    return res
  });
  return resp
}
}
