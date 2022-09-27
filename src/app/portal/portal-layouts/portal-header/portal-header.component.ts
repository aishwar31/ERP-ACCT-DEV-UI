import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MainService } from '../../service/main.service';
import { ProfileService } from '../../service/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: '[app-portal-header]',
  templateUrl: './portal-header.component.html',
  styleUrls: ['./portal-header.component.css']
})
export class PortalHeaderComponent implements AfterViewInit {

  imgURL;
  erpUser;
  userInfo = { first_name: 'UNKNOWN', designation: 'Accountant' }
  constructor(public auth: AuthenticationService, private router: Router, private profileService: ProfileService, private sanitizer: DomSanitizer, public mainService: MainService) { }
  hidden = true;
  accInfo = {}
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));

    var dd=[];
    dd=this.erpUser.role_cd
    if (dd.includes("AA")) {
      this.hidden = false;
    } else {
      this.hidden = true
    }

    await this.mainService.getUserImage(this.erpUser['user_id']);
    await this.mainService.getAccImage(this.erpUser['b_acct_id']);
    await this.mainService.getAccountInfo(this.erpUser['b_acct_id']);

    await this.changeLanguage();
  }

  


  changeLanguage() {
    console.log("laungage Change");
    this.mainService.language_cd = this.auth.language_cd
    this.mainService.allLanguage = this.auth.allLanguage
  }

  home() {
    this.router.navigate(['/index'])
  }
  ngAfterViewInit() {
  }



























  // async getUserImage() {
  //   const res = await this.profileService.getImage(this.user_id);
  //   console.log(res)

  //   if (res) {
  //     const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
  //     this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
  //     this.mainService.profileImageUrl = this.imgURL;
  //   }
  // }


  // async getUserInfo(){
  //   var resp= await this.profileService.getUserProfileInfo(this.user_id);
  //   console.log(resp);
  //   if(resp['error']==false){
  //     this.userInfo=resp.data[0];
  //     var erp=this.erpUser;
  //     erp['User_name']=this.userInfo['first_name']+" "+this.userInfo['last_name'];
  //     localStorage.setItem('erpUser', JSON.stringify(erp));

  //     // console.log(this.userInfo)
  //   }else{

  //   }
  // }
  
  // async getAccImage() {
  //   const res = await this.profileService.getAccImage(this.erpUser.b_acct_id);
  //   if (res) {
  //     const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
  //     this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
  //     this.mainService.accountImageUrl = this.imgURL;

  //   }
  // }
  // async getAccInfo() {
  //   var resp = await this.profileService.getAccProfileInfo(this.erpUser.b_acct_id);
  //   console.log(resp);
  //   if (resp['error'] == false) {
  //     this.accInfo = resp.data[0];
  //     this.mainService.accInfo = this.accInfo;
  //   } else {

  //   }

  // }

}


