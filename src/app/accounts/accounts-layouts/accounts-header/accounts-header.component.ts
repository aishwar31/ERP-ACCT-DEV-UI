import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MainService } from '../../service/main.service';
import { ProfileService } from '../../../portal/service/profile.service';
import { Router } from '@angular/router';
import { MainService as portal_mainService } from '../../../portal/service/main.service';

@Component({
  selector: '[app-accounts-header]',
  templateUrl: './accounts-header.component.html',
  styleUrls: ['./accounts-header.component.css']
})
export class AccountsHeaderComponent implements OnInit {

  constructor(public auth: AuthenticationService, private router: Router, public portal_main: portal_mainService,
    public mainService: MainService, private profileService: ProfileService, private sanitizer: DomSanitizer) { }

  erpUser = {};
  async ngOnInit() {
    this.erpUser = JSON.parse(sessionStorage.getItem('erpUser'));
    await this.portal_main.getUserImage(this.erpUser['user_id']);
    await this.portal_main.getAccImage(this.erpUser['b_acct_id']);
    await this.portal_main.getAccountInfo(this.erpUser['b_acct_id']);
    await this.portal_main.getHeaderInfo(this.erpUser['b_acct_id']);
    await this.changeLanguage();
  }
  
  changeLanguage() {
    console.log("laungage Change");
    this.mainService.language_cd = this.auth.language_cd
  }

  home() {
    this.router.navigate(['/index'])
  }

  ngAfterViewInit() {
  }

}
