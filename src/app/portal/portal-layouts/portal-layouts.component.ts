import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import {Helpers} from "../../helpers";
import {MainService} from '../service/main.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileService} from '../service/profile.service';
import {Router} from '@angular/router'
import { SecurityService } from "910-shared-ngx/dist/security";

@Component({
  selector: '.page-wrapper',
  templateUrl: './portal-layouts.component.html',
  styleUrls: ['./portal-layouts.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PortalLayoutsComponent implements AfterViewInit {
  codeValueObj={};
  codeValueTechObj={};
  codeValueShowObj={};
  codeValueShowTempObj={};
  b_acct_id;
  erpUser;
  empObj={}
  constructor(private sanitizer: DomSanitizer,private snackBar:MatSnackBar,private profileService:ProfileService,private securitySVC: SecurityService,private mainService:MainService,private router : Router) { }
  async ngOnInit() {
    this.securitySVC.isAuthenticated();
    if(sessionStorage.getItem('erpUser')!=undefined || sessionStorage.getItem('erpUser')!=null){
      var erpUser = JSON.parse(sessionStorage.getItem('erpUser'));
      localStorage.setItem('erpUser', JSON.stringify(erpUser));
    }
    if(localStorage.getItem('erpUser')==undefined || localStorage.getItem('erpUser')==null){
      this.router.navigate(['/login']);
    }else{
      this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
      this.b_acct_id = this.erpUser.b_acct_id;
    }
    await this.getAllTaskOfUser()
    await this.mainService.getAllLanguage()
    await this.mainService.getAllLabel();
    await this.mainService.getHeaderInfo(this.b_acct_id)
  }
  async getAllTaskOfUser() {
    var obj = Object()
    obj['b_acct_id'] = this.erpUser.b_acct_id
    obj['user_id'] = this.erpUser.user_id
    obj["status"] = 'PENDING'
    console.log(obj)
    var resp = await this.mainService.getAllTaskOfUser(JSON.stringify(obj))
    if (resp['error'] == false) {
      console.log(resp['data'])
      this.mainService.count = resp['data'].length
    } else {
   
    }
  }

 

  async getCodeValue(){
   
    var resp = await this.mainService.getCodeValue(this.b_acct_id);
    console.log(resp);
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
      console.log(this.codeValueObj);
      console.log(this.codeValueShowObj);
    }else{

    }

  }
  ngAfterViewInit() {

    // initialize layout: handlers, menu ...
    Helpers.initLayout();

  }
  async getEmpInfo() {
    var resp = await this.profileService.getUserProfileInfo(this.erpUser.user_id);
    if (resp['error'] == false) {
      this.empObj = resp['data'][resp['data'].length-1];
    } else {
      this.snackBar.open(resp['data'], 'Error', {
        duration: 5000,
      });
    }

  }
  async getEstablishmentInfo(){
    var obj = new Object();
    obj['b_acct_id'] = this.erpUser.b_acct_id;
    obj['email'] = this.empObj['email'];
    obj['phone_no'] = this.empObj['work_phone_no'];
    var resp = await this.profileService.getEstablishmentInfo(JSON.stringify(obj));
    if(resp['error'] == false){
      if(resp['data'].length>0){
        var dt = resp['data'][0];
        this.mainService.emp_id = dt['emp_id'];
        this.mainService.personalInfoObj = dt;

      }
     
    }else{

    }
  }

}
