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
function readBase64(file): Promise<any> {
  var reader = new FileReader();
  var future = new Promise((resolve, reject) => {
    reader.addEventListener("load", function () {

      resolve(reader.result);
    }, false);

    reader.addEventListener("error", function (event) {
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}
 
 
@Component({
  selector: 'app-acc-faq',
  templateUrl: './acc-faq.component.html',
  styleUrls: ['./acc-faq.component.css']
})
export class AccFaqComponent implements OnInit {
  user_id;
  user_email;
  ebillUser;
  b_acct_id;
  name;
 

  dataSource;


  selectFileType
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('sortCol3', { static: true }) sortCol3: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sortCol2') sortCol2: MatSort;


 
  constructor(private router: Router, private spinner: NgxSpinnerService,
    private userService: UserService, private profileService: ProfileService,
    private sanitizer: DomSanitizer, public mainService: MainService) {
    this.selectFileType = null
  }

  Message;
  Subject;
  displayedColumns_for_FAQ = ['s_no', 'question', 'answer']


  async ngOnInit() {
    this.ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.ebillUser.b_acct_id;
    this.name = this.ebillUser.name;
    await this.getAllFAQ();
 
  }
  AllFAQ=[];
  async  getAllFAQ() {
    var obj = new Object();
    obj['type'] = "FAQ";
    var resp = await this.userService.getHelpData(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data);
      let dummy = []
      for (let i = 0; i < resp['data'].length; i++) {
        if (resp['data'][i]['module_cd'] == 'ACCOUNT') {
          dummy.push(resp['data'][i])
        }
      }
      this.AllFAQ=dummy
      this.dataSource = new MatTableDataSource(dummy);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {

    }
  }

 


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
