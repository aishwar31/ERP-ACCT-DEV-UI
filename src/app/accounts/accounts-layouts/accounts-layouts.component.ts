import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';

import {AuthenticationService} from '../../authentication.service';
import {Helpers} from "../../helpers";
import {MainService} from '../service/main.service';
import {Router} from '@angular/router'
import {SettingService} from '../service/setting.service';

@Component({
  selector: '.page-wrapper',
  templateUrl: './accounts-layouts.component.html',
  styleUrls: ['./accounts-layouts.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountsLayoutsComponent implements AfterViewInit {

  constructor(public auth:AuthenticationService,private settingService:SettingService,private mainService: MainService,private router : Router) { }
  b_acct_id=-1;
  erpUser;
  allFields=[];
  allCodeValue=[];
  codeValueObj={};
  codeValueTechObj={};
  codeValueShowObj={};
  async ngOnInit() {
    if(sessionStorage.getItem('erpUser')==undefined || sessionStorage.getItem('erpUser')==null){
      this.router.navigate(['/login']);
    }else{
      this.erpUser = JSON.parse(sessionStorage.getItem('erpUser'));
      this.b_acct_id = this.erpUser.b_acct_id;
      await this.getCodeValue();
     
    }
    await this.getAllTaskOfUser()
    await this.mainService.getAllLanguage()
    await this.mainService.getAllLabel()
  }
  async getAllTaskOfUser() {
    var obj = Object()
    obj['b_acct_id'] = this.erpUser.b_acct_id
    obj['user_id'] = this.erpUser.user_id
    obj["status"] = 'PENDING'
    console.log(obj)
    var resp = await this.mainService.getAllTaskOfUser(JSON.stringify(obj))
    if (resp['error'] == false) {
      // this.spinner.hide();
      console.log(resp['data'])
      
      this.mainService.count = resp['data'].length
      //this.toastr.successToastr("Approval Forwarded Successfully!!")
    } else {
      // this.spinner.hide();
      //swal.fire("Error", resp['data'], 'error');
    }
  }
  async getCodeValue(){
   
    var resp = await this.settingService.getCodeValue(this.b_acct_id);
    var codeValueTempObj={}
    var codeValueShowTempObj={};
    if(resp['error']==false){
      for(var i=0;i<resp.data.length;i++){
        if(codeValueTempObj[resp.data[i]['field_code']]== undefined){
          codeValueTempObj[resp.data[i]['field_code']] = [];
          codeValueShowTempObj[resp.data[i]['field_code']] ={}
        }
        codeValueShowTempObj[resp.data[i]['field_code']][resp.data[i].code] = resp.data[i].value;
        codeValueTempObj[resp.data[i]['field_code']].push(resp.data[i])
      }
      this.codeValueObj = codeValueTempObj;
      this.codeValueShowObj = codeValueShowTempObj;
      this.mainService.codeValueTechObj = this.codeValueObj;
      this.mainService.codeValueShowObj = this.codeValueShowObj;

    }else{

    }

  }
  ngAfterViewInit() {

    // initialize layout: handlers, menu ...
    Helpers.initLayout();

  }

}


