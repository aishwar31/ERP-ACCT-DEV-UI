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
  selector: 'app-acc-user-manual',
  templateUrl: './acc-user-manual.component.html',
  styleUrls: ['./acc-user-manual.component.css']
})
export class AccUserManualComponent implements OnInit {

 
  user_id;
  user_email;
  ebillUser;
  b_acct_id;
  name;

  pdfURL;
  imageBlobUrl;
  selectedFile: File = null;
  isUpload;
  public imagePath;
  httpUrl;
  uploader;
  dataSource;
  dataSource1;
  dataSource2;

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
  displayedColumns_for_DOC = ['s_no', 'name', 'doc_name', 'action']



  async ngOnInit() {
    this.ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.ebillUser.b_acct_id;


    this.httpUrl = this.mainService.httpUrl;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'file' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.name = this.ebillUser.name;
    await this.getAllDOC();
  }

  async view_doc(element) {
    this.spinner.show();
    var obj = Object.assign({}, element);
    var res = await this.userService.gethelpDocument(obj);
    let file = new Blob([res], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(file);
    this.spinner.hide();
    window.open(fileURL);

  }



  async getAllDOC() {
    var obj = new Object();
    obj['type'] = "DOC";
    var resp = await this.userService.getHelpData(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data);
      let dummy = []
      for (let i = 0; i < resp['data'].length; i++) {
        if (resp['data'][i]['module_cd'] == "ACCOUNT") {
          dummy.push(resp['data'][i])
        }
      }
      this.dataSource1 = new MatTableDataSource(dummy);
      this.dataSource1.sort = this.sortCol2;
      this.dataSource1.paginator = this.paginator1;
    } else {

    }
  }



  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

}
