import { Component, OnInit, ViewChild } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import { MainService } from '../../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { ProfileService } from '../../service/profile.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/emb/service/user.service';

declare var $: any;
 
 
@Component({
  selector: 'app-acc-online-support',
  templateUrl: './acc-online-support.component.html',
  styleUrls: ['./acc-online-support.component.css']
})
export class AccOnlineSupportComponent implements OnInit {

 
  user_id;
  user_email;
  ebillUser;
  b_acct_id;
  name;
 
 

 
  constructor(private router: Router, private spinner: NgxSpinnerService,
    private userService: UserService, private profileService: ProfileService,
    private sanitizer: DomSanitizer, public mainService: MainService) {
  }

  Message;
  Subject;
 

  async ngOnInit() {
    this.ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.ebillUser.b_acct_id;

  }
  Submit() {
    console.log(this.Subject);
    console.log(this.Message);
  }

}
