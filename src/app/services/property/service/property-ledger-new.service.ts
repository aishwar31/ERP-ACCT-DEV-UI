import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyLedgerNewService {
  httpUrl;

  constructor(private http: HttpClient, private main: MainService) {
      this.httpUrl = this.main.httpUrl;
  }

// apihost = environment.ddHost 
// apiport = environment.ddport || "3012"

// httpapi=this.apihost+":"+this.apiport
// async getdata(obj,obj2){
     
//     const  resp = await this.http.post<any>(this.httpapi+obj2 ,obj).toPromise().then(res => {
      
//        return res;
//      });
//      return resp;
//    }

async getEventBal(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/re/ev/bal' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
async getallpayments(obj)
{
    console.log(obj)
    const resp = await this.http.post(this.httpUrl + '/property/getPaymentDetails', obj).toPromise().then(res => {
        return res

    });
    console.log(resp);
    
    return resp
}

async view_adjust(obj)
{
    console.log(obj)
    const resp = await this.http.post(this.httpUrl + '/property/getAdjDetails', obj).toPromise().then(res => {
        return res

    });
    console.log(resp);
    
    return resp
}
async getDemandDetails(obj)
{
    console.log(obj)
    const resp = await this.http.post(this.httpUrl + '/property/getDemandDetails', obj).toPromise().then(res => {
        return res

    });
    console.log(resp);
    
    return resp
}
async getpayoff(obj) {
    
    console.log(obj)
    const resp = await this.http.post(this.httpUrl + '/arr/getPayOff', obj).toPromise().then(res => {
        return res

    });
    console.log(resp);
    
    return resp
}
// async getpyamentschedule() {
    
//     return this.pmtschedules
// }
async getnewLedger0(obj) {
    console.log(obj)
    const resp = await this.http.post(this.httpUrl + '/arr/getArrEvents', obj).toPromise().then(res => {
        return res
    });
    console.log(resp);    
    return resp
    // return this.events3
}
  async getHeaderDetails(obj) {
      const resp = await this.http.post(this.httpUrl + '/arr/getLedgerHeader', obj).toPromise().then(res => {
          return res
      });
      return resp
  }

 async getSummary(obj)
 {
  const resp = await this.http.post(this.httpUrl + '/arr/getArrBalance', obj).toPromise().then(res => {
    return res
});
return resp

 }

  async getInstrBalance(obj)
  {
    const resp = await this.http.post(this.httpUrl + '/arr/getInstrBalance', obj).toPromise().then(res => {
      return res
  });
  return resp
  
  }

async getProperties(obj)
{
    const resp = await this.http.post(this.httpUrl + '/arr/getUniqueSku', obj).toPromise().then(res => {
        return res
    });
    return resp
}
async getLEDGER(obj)
{
    console.log(obj)
    const resp = await this.http.post(this.httpUrl + '/arr/getArrEvents', obj).toPromise().then(res => {
        return res

    });
    console.log(resp);
    
    return resp
}
}
