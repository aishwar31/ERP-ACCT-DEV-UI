import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  //header data;
  info1 = { name: 'UNKNOWN', designation_cd: 'UNKNOWN' }
  info2 = { name: 'UNKNOWN', designation_cd: 'UNKNOWN' }










  Info1ImageUrl = './assets/img/admin-avatar.png';
  Info2ImageUrl = './assets/img/admin-avatar.png';

  //httpUrl="http://localhost:3001";
  //httpUrl="http://139.59.61.84:3001";
  //httpUrl="http://143.110.244.179:3000";
  //httpUrl="https://vdaerp.svayamtech.com:3000"
  httpUrl = this.auth.httpUrl;
  // httpUrl="https://vdaerp.svayamtech.com:3002";
  //httpUrl="http://139.59.61.84:3000";
  count = 0
  tasks = 0;
  emp_id;
  accInfo = {account_name:'ACCOUNT NAME'};
  componentCode = {};
  codeValueTechObj = {};
  codeValueShowObj = {}
  httpUrl1 = ""
  personalInfoObj = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private auth: AuthenticationService) {
    this.httpUrl1 = this.httpUrl + "/hr/setting";
  }



  //*****************************************************Profile Image********************************************** */
  imgURL_Profile;
  profileImageUrl = './assets/img/admin-avatar.png';

  async getUserImage(user_id) {
    const res = await this.getImage(user_id);
    console.log(res)
    if (res) {
      this.profileImageUrl = './assets/img/admin-avatar.png';
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL_Profile = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.profileImageUrl = this.imgURL_Profile;
    } else {
      this.profileImageUrl = './assets/img/admin-avatar.png';
    }
  }


  async getImage(user_id) {
    const obj = new Object();
    obj['user_id'] = user_id;
    const resp = await this.http.post(this.httpUrl + '/portal/getprofileimage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }


  //*****************************************************Profile Image********************************************** */



  //*****************************************************Account Image********************************************** */


  imgURL_account;
  accountImageUrl = './assets/img/account.png';


  async getAccImage(b_acct_id) {
    const res = await this.getAccImageApi(b_acct_id);
    if (res) {
      this.accountImageUrl = './assets/img/account.png';
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL_account = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.accountImageUrl = this.imgURL_account;
      console.log("Get Image");
    } else {
      console.log("Not Get Image");
      this.accountImageUrl = './assets/img/account.png';
    }
  }

  async getAccImageApi(b_acct_id) {
    const obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    const resp = await this.http.post(this.httpUrl + '/portal/getAccountImage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }
  //*****************************************************Account Image********************************************** */

  ///********************************************Account Info******************************************************* */
  async getAccountInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    console.log(obj)
    var resp = await this.getaccountmodule(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.accInfo = resp['data'][0]
    } else {

    }
  }

  async getaccountmodule(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getaccountmodule' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  ///********************************************Account Info******************************************************* */



  //***************************************************** Language ********************************************** */


  allLanguage = []
  language_cd
  async getAllLanguage() {
    var obj = new Object();
    var resp = await this.getAllLanguages(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.allLanguage = resp.data;
      this.language_cd = resp.data[0]['language_cd']
    } else {

    }
  }
  allLableShowObj = {}
  allLabel = []
  async getAllLabel() {
    var obj = new Object();
    obj['module_cd'] = 'MD'
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
  //***************************************************** Language ********************************************** */


  //***************************************************** Header Info ********************************************** */


  async getHeaderInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    var resp = await this.getheaderinfo(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      console.log(resp.data);

      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['info_no'] == 1) {
          this.info1 = resp.data[i];
          console.log(this.info1)
          await this.getHeaderInfoImage(resp.data[i]['info_no'], resp.data[i]['upload_file_name'], b_acct_id)
        }
        if (resp.data[i]['info_no'] == 2) {
          this.info2 = resp.data[i]
          await this.getHeaderInfoImage(resp.data[i]['info_no'], resp.data[i]['upload_file_name'], b_acct_id)

        }
      }
    } else {

    }
  }

  imgURL
  async getHeaderInfoImage(info_no, filename, b_acct_id) {
    var ob = new Object();
    ob['b_acct_id'] = b_acct_id;
    ob['info_no'] = info_no;
    ob['filename'] = filename;
    console.log(ob)
    if (filename == null || filename == undefined) {

    } else {
      const res = await this.getheaderImage(ob);
      if (res) {
        const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
        this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        if (info_no == 1) {
          this.Info1ImageUrl = this.imgURL;
        }
        if (info_no == 2) {
          this.Info2ImageUrl = this.imgURL;
        }
      }
    }

  }


  //***************************************************** Header Info ********************************************** */




  //set header detail
  async sendMsg(mobile, message) {
    //console.log(otp + "@123")
    var str = "https://2factor.in/API/R1/?module=TRANS_SMS&apikey=f5b33455-838a-11ea-9fa5-0200cd936042&to="+ mobile +"&from=EMBINF&templatename=EMB+Approval&var1="+ message
   // var str = "https://2factor.in/API/V1/f5b33455-838a-11ea-9fa5-0200cd936042/SMS/" + mobile + "/" + otp + "/ERPUPDA"
    const resp = this.http.get<any>(str).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getembxrefappr(obj){
    const resp= this.http.get<any>(this.httpUrl+'/emb/info/emb/getxrefembxrefappr'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async changestatus(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/emb/info/emb/changestatus', obj).toPromise().then(res => {
      return res;
    });
    return resp;
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
  async getCodeValue(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/codeValue/getCodeValues' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllUsers(acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getallusers' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllAssignedComponents(acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/md/resource/getresourcebyrolecd' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getWorkflows(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/workflow/getWorkflows' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getUsersForModuleWorkflow(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/workflow/getUsersForModuleWorkflow' + obj).toPromise().then(res => {
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
  async getundertakingsWithWorkflow(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/undertakings/getundertakingWithWorkflow' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getWorkflowlog(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/workflowlog/getWorkflowlog' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async insertTask(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/metadata/workflowlog/insertTask', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updatetask(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/metadata/workflowlog/updatetask', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async updateWorkflowDocumentStatus(obj) {
    const res = await this.http.put<any>(this.httpUrl + '/metadata/workflow/updateWorkflowDocumentStatus', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getGenCbById(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/emb/info/cb/getGenCbById' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //getMostLatestWorkflowlog
  async getMostLatestWorkflowlog(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/metadata/workflowlog/getMostLatestWorkflowlog' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  //header Info
  async getheaderinfo(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/headerInfo/getheaderinfo' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateheaderinfo(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/metadata/headerInfo/updateheaderinfo', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getheaderImage(obj) {
    const resp = await this.http.post(this.httpUrl + '/metadata/headerInfo/getheaderImage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }
  async createevent(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/accounts/eventgroup/addEventGroup', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getcurrentlegalentity(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getcurrentlegalentity' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
