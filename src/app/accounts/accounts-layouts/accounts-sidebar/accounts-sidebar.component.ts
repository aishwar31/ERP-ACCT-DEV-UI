import {AuthenticationService} from '../../../authentication.service';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {MainService} from '../../service/main.service';
import {ProfileService} from '../../service/profile.service';
import {Router} from '@angular/router';

@Component({
  selector: '[app-accounts-sidebar]',
  templateUrl: './accounts-sidebar.component.html',
  styleUrls: ['./accounts-sidebar.component.css']
})
export class AccountsSidebarComponent{

  user_id;
  imgURL;
  erpUser;
  userInfo={emp_name:'Ram Prasad',designation:'Accountant'}
  constructor(public auth:AuthenticationService, private router:Router,private profileService: ProfileService,private sanitizer: DomSanitizer, public mainService: MainService) {}
  hidden=true;
  accInfo={}
  async ngOnInit() {
    this.erpUser = JSON.parse(sessionStorage.getItem('erpUser'));
    this.user_id = this.erpUser.user_id;
    if(this.erpUser.is_admin==0){
      this.hidden=true;
    }else{
      this.hidden=false
    }
    this.imgURL = './assets/img/admin-avatar.png';
    await this.getUserImage();
    await this.getUserInfo();
    await this.getAccImage();
    await this.getAccInfo();
  }
 

  home() {
    this.router.navigate(['/index'])
  }
  
  async getUserImage(){
    const res = await this.profileService.getImage(this.user_id);
    if (res) {
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.mainService.profileImageUrl=this.imgURL;
      
    }
  }
  async getUserInfo(){
    var resp= await this.profileService.getUserProfileInfo(this.user_id);
    if(resp['error']==false){

      this.userInfo=resp.data[0];
    }else{

    }
  }
  async getAccImage() {
    const res = await this.profileService.getAccImage(this.erpUser.b_acct_id);
    if (res) {
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.mainService.accountImageUrl = this.imgURL;
    }
  }
  async getAccInfo() {
    var resp = await this.profileService.getAccProfileInfo(this.erpUser.b_acct_id);
    if (resp['error'] == false) {
      this.accInfo = resp.data[0];
      this.mainService.accInfo = this.accInfo;
    } else {

    }

  }

}
