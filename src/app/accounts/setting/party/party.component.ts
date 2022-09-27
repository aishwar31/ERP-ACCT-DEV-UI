import { Component, OnInit, ViewChild } from '@angular/core';

import { MainService as Emb_mainService } from '../../../services/emb/service/main.service';
import { IpService } from '../../service/ip.service';
import { MainService as MD_mainService } from '../../../services/md/service/main.service';
import { MainService } from '../../service/main.service';
import { MainService as MainServiceAdmin } from '../../../services/admin/service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { SettingService } from '../../service/setting.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

declare var $: any

 
@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class AccountsPartyComponent implements OnInit {

  constructor(private ipService: IpService, private mainServiceAdmin: MainServiceAdmin, private settingService: SettingService, public mainService: MainService, private MD_mainService: MD_mainService, private spinner: NgxSpinnerService, private snackBar: MatSnackBar, private emb_mainService: Emb_mainService) { }

  @ViewChild('stepper1') stepper1: MatStepper;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['party_legal_name', 'le_id', 'party_origination_source_code', 'party_type_code', 'party_phone_no', 'party_email', 'party_city', 'action'];
  datasource;
  partyObj = {};
  status = [{ code: "ACTIVE", value: "ACTIVE" }, { code: "INACTIVE", value: "INACTIVE" }];
  party_type = [{ code: "IND", value: "IND" }, { code: "ORG", value: "ORG" }];


  erpUser;
  user_id;
  b_acct_id;
  allParty = [];
  post_data = [];
  techToBusNameObj = {};
  modobj = {}

  list_flag = true
  create_flag = false
  update_flag = false
  open_create() {
    this.list_flag = false
    this.create_flag = true
    this.update_flag = false
  }

  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    this.user_id = this.erpUser.user_id;
    // await this.getAllParties();
    await this.getListOfAllParty();
    await this.getallFields();
    // await this.getIpDetails();
    await this.getmaxlclno();
  }

  open_update(element) {
    this.list_flag = false
    this.create_flag = false
    this.update_flag = true
    this.partyObj = Object.assign({}, element);
    // var date = this.partyObj['effective_date'].split("T")
    // this.partyObj['effective_date'] = date[0]
    // $('.nav-tabs a[href="#tab-3"]').tab('show')
  }


  allFields = [];
  async getallFields() {

    var obj = new Object();
    obj['table_name'] = 'field_info';
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.ipService.getFields(obj);
    this.allFields = [];
    if (resp['error'] == false) {

      this.allFields = resp.data;

    } else {
      this.snackBar.open("Error while getting Fields", "Error", {
        duration: 5000,
      });
    }


  }
  maxlocalno
  async getmaxlclno() {

    var obj = new Object();

    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.ipService.getmaxlclno(this.b_acct_id);
    this.allFields = [];
    if (resp['error'] == false) {
      this.maxlocalno = resp.obj[0]['MAX(local_no)'];
      if (this.maxlocalno == null) {
        this.maxlocalno = 0;
      }

    } else {
      this.snackBar.open("Error while getting Fields", "Error", {
        duration: 5000,
      });
    }


  }
  field_code = [];
  displayedColumns_temp = [];
  async getIpDetails() {
    var resp = await this.ipService.getipdata(this.b_acct_id);
    if (resp['error'] == false) {
      var ip_dtl = resp.data[0];
      this.displayedColumns_temp = [];
      this.displayedColumns = [];
      this.techToBusNameObj = {};
      var ip_fields_code = ip_dtl.field_code.split(",");
      console.log(ip_fields_code);

      this.field_code = [];
      for (let i = 0; i < ip_fields_code.length; i++) {
        for (let j = 0; j < this.allFields.length; j++) {
          if (ip_fields_code[i] == this.allFields[j]['field_code']) {
            if (this.allFields[j]['field_technical_name'] == 'create_timestamp' ||
              this.allFields[j]['field_technical_name'] == 'create_user_id' ||
              this.allFields[j]['field_technical_name'] == 'update_timestamp' ||
              this.allFields[j]['field_technical_name'] == 'update_user_id') {
            } else {
              this.displayedColumns.push(this.allFields[j]['field_technical_name']);
              this.displayedColumns_temp.push(this.allFields[j]['field_technical_name']);
              this.techToBusNameObj[this.allFields[j]['field_technical_name']] = this.allFields[j]['field_business_name'];


              var datatype = this.allFields[j]['datatype_code'];
              var temp_type;
              if (datatype == 'bigint(20)' || datatype == 'double' || datatype == 'int(11)') {
                temp_type = 'number';
              } else if (datatype == 'date') {
                temp_type = 'date';
              } else if (datatype == 'varchar(200)' || datatype == 'varchar(50)' || datatype == 'text') {
                temp_type = 'text';
              } else {
                temp_type = 'text'
              }
              this.field_code.push({
                field_business_name: this.allFields[j]['field_business_name'],
                field_technical_name: this.allFields[j]['field_technical_name'],
                field_code: ip_fields_code[i], type: temp_type
              })
            }
          }
        }
      }
      this.displayedColumns.push('action');

    } else {
      this.snackBar.open("Error while getting ip Records", "Error", {
        duration: 5000,
      });
    }
  }

  refresh() {
    this.partyObj = {};
  }

  // async getAllParties() {
  //   this.spinner.show()
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   var resp = await this.settingService.getPartyInfoNew(this.b_acct_id);
  //   if (resp['error'] == false) {
  //     this.allParty = resp.data;
  //     this.datasource = new MatTableDataSource(this.allParty)
  //     this.datasource.paginator = this.paginator;
  //     this.datasource.sort = this.sort;
  //     this.spinner.hide();

  //   } else {
  //     this.spinner.hide();
  //     swal.fire("Error", "...Error while getting  all party list!",'error');

  //   }
  // }

  async save() {
    this.spinner.show();
    this.partyObj['create_user_id'] = this.erpUser.user_id;
    //this.partyObj['party_id'] = 'ACC' + this.partyObj['party_local_no'];
    this.partyObj['local_no'] = this.maxlocalno + 1
    this.partyObj['party_id'] = 'ACC' + this.partyObj['local_no']
    var obj1 = new Object();
    obj1['data'] = this.partyObj;
    obj1['b_acct_id'] = this.b_acct_id;

    var resp = await this.settingService.createPartyNew(obj1);
    if (resp['error'] == false) {
      this.spinner.hide();
      // await this.getAllParties();
      await this.getListOfAllParty();

      await this.getmaxlclno();
      swal.fire("Success", "...Party Added Successfully!", 'success');
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error while Adding Party!", 'error');
    }
  }

  async update() {
    this.spinner.show();

    let post_data = [];
    console.log(this.partyObj);


    post_data.push({
      id: this.partyObj['id'],
      party_legal_name: this.partyObj['party_legal_name'],
      le_id: this.partyObj['le_id'],
      party_origination_source_code: this.partyObj['party_origination_source_code'],
      party_type_code: this.partyObj['party_type_code'],
      party_phone_no: this.partyObj['party_phone_no'],
      party_email: this.partyObj['party_email'],
      party_city: this.partyObj['party_city'],
      credential: this.partyObj['credential'],
      party_name: this.partyObj['party_name'],
      party_dob: this.partyObj['party_dob'],
      party_adhaar_no: this.partyObj['party_adhaar_no'],
      party_state: this.partyObj['party_state'],
      party_country: this.partyObj['party_country'],
      party_pan_no: this.partyObj['party_pan_no'],
      party_addr_line1: this.partyObj['party_addr_line1'],
      party_addr_line2: this.partyObj['party_addr_line2'],
      effective_date: this.partyObj['effective_date'],
      party_bank_acct_no: this.partyObj['party_bank_acct_no'],
      party_bank_code: this.partyObj['party_bank_code'],
      party_branch_code: this.partyObj['party_branch_code'],
      party_ifsc_code: this.partyObj['party_ifsc_code'],
      party_gst_no: this.partyObj['party_gst_no'],
      create_user_id: this.erpUser.user_id

    })


    this.partyObj['update_user_id'] = this.erpUser.user_id;

    var obj1 = new Object();
    for (let i = 0; i < this.displayedColumns_temp.length; i++) {
      obj1[this.displayedColumns_temp[i]] = this.partyObj[this.displayedColumns_temp[i]];
    }
    obj1['update_user_id'] = this.erpUser.user_id;
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['create_user_id'] = this.user_id;
    obj['data'] = post_data;


    console.log(obj);
    console.log(resp);
    console.log(post_data);

    var resp = await this.settingService.updateParty(obj);

    console.log(resp);


    if (resp['error'] == false) {
      this.spinner.hide();
      await this.open_list();
      await this.getListOfAllParty();
      swal.fire("Success", "...Party Update Successfully!", 'success');
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error while updating Party!", 'error');
    }
  }

  async deleteParty(element) {
    // this.spinner.show()
    var obj = new Object();

    console.log(element);

    obj['b_acct_id'] = this.b_acct_id;
    // obj['emp_id'] = element['emp_id'];
    // obj['arr_id'] = element['arr_id'];
    obj['id'] = element['id']
    obj['le_id'] = element['le_id'];
    obj['update_user_id'] = this.erpUser.user_id;
    console.log(obj)
    var resp = await this.settingService.deleteParty(obj);
    if (resp['error'] == false) {

      setTimeout(async () => {
        // await this.getAllParties();
        await this.getListOfAllParty();
        this.spinner.hide()
        swal.fire('success', resp.data, 'success');
      }, 1000);

    } else {
      this.spinner.hide();
      swal.fire('Error', resp.data, 'error')
    }
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  validate(email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email) == false) {
      return (false);
    } else {
      return true
    }
  }

  underAgeValidate(j, d) {
    var dob = d.split('-');
    var year = parseInt(dob[0]);
    var month = parseInt(dob[1]) - 1;
    var day = parseInt(dob[2]);
    var today = new Date(j);
    var age = today.getFullYear() - year;
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
      age--;
    }
    return age;
  }
  cpObj = {}
  next_button_2 = false;


  async searchtab2() {

    this.next_button_2 = false;
    this.disable_flag = false
    this.cpObj = new Object()
    var obj = new Object();
    console.log(this.partyObj['credential'])
    if (await this.findEmployeeInAccount()) {
      $('#myModal1').modal('show');
      return;
    }
    obj['b_acct_id'] = this.b_acct_id
    if (isNaN(this.partyObj['credential'])) {
      obj['contact_email'] = this.partyObj['credential']
      this.partyObj['party_email'] = this.partyObj['credential']
    } else {
      obj['phone_no'] = this.partyObj['credential']
      this.partyObj['party_phone_no'] = this.partyObj['credential']
    }
    this.spinner.show()
    var resp = await this.MD_mainService.getCurrentLegalEntity(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide();
      if (resp['data'].length > 0) {
        console.log(resp)
        if (resp['data'][0]['party_type'] == 'IND') {

          this.disable_flag = true;
          this.party_exit = true;
          this.partyObj['party_type'] = 'IND'
          this.partyObj['party_name'] = resp['data'][0]['party_name']
          this.partyObj['party_phone_no'] = resp['data'][0]['phone_no']
          this.partyObj['party_email'] = resp['data'][0]['contact_email']
          this.partyObj['le_flag'] = false;
          this.partyObj['le_id'] = resp['data'][0]['le_id']
          this.partyObj['le_flag'] = false;
          if (resp['data'][0]['party_dob'] != null) {
            this.dob_blank = false;
            this.partyObj['party_dob'] = resp['data'][0]['party_dob'].split('T')[0];
          } else {
            this.dob_blank = true;

          }
          this.next_button_2 = true;
          this.partyObj['new_entity'] = false;
          this.partyObj['ident_verify_secret'] = 'User@1';
          Swal.fire('Warning...', 'A person with searched email/phone number is already available. Following are the details for this person. If you want to add this person as employee then you can continue by clcking "next". If this is not the person that you wanted to add then please click "Back" and search using different phone and/or email.', 'warning')

        }
      }
    }
    console.log(this.partyObj['credential'])

    if (this.partyObj['party_type'] == undefined || this.partyObj['party_type'] == null) {
      this.party_exit = false;
      this.dob_blank = true;
      this.next_button_2 = false;
      swal.fire("Error", 'The Legal Entity does not exist. You will need to first create a new legal entity with these details before you can setup the legal entity as Party.', 'error')
    }
    this.stepper1.next();
  }


  // AllLegalEntity = [];
  // async getAllLegalEntity() {
  //   var resp = await this.mainServiceAdmin.getCurrentLegalEntity(this.b_acct_id);
  //   console.log(resp)
  //   if (resp['error'] == false) {
  //     this.AllLegalEntity = resp.data;
  //   } else {

  //   }

  // }

  async submitlegal() {

    console.log("submit legal");

    if (this.partyObj['party_dob']) {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      let today_date = mm + '-' + dd + '-' + yyyy;
      var jdt = today_date
      var ddt = this.partyObj['party_dob'];
      var yr = this.underAgeValidate(jdt, ddt);
      console.log(yr);

    }
    this.partyObj['valid_upto'] = '2030-10-22'
    this.partyObj['party_type'] = 'IND'
    this.partyObj['contact_email'] = this.partyObj['party_email']
    this.partyObj['contact_phone'] = this.partyObj['party_phone_no']
    this.partyObj['ident_verify_secret'] = 'work4fun';
    if (!this.partyObj['party_type']) {
      swal.fire("Error", 'Please Select Legal Entity Type', 'error')
      console.log("1");

    } else if (!this.partyObj['contact_email']) {
      swal.fire('Error', 'Please Enter Email', 'error')
      console.log("2");
    }
    else if (!this.validate(this.partyObj['contact_email'])) {
      swal.fire('Error', 'Please Enter A Valid Email', 'error')
      console.log("3");
    } else if (!this.partyObj['contact_phone']) {
      swal.fire('Error', 'Please Enter Mobile Number', 'error')
      console.log("4");
    }
    else if (!this.partyObj['party_dob'] && this.partyObj['party_type'] == 'IND') {
      swal.fire('Error', 'Please Enter Date Of Birth', 'error')
      console.log("5");
    }
    else if (yr < 18 && this.partyObj['party_type'] == 'IND') {
      swal.fire('Error', 'Your Age less than 18', 'error')
      console.log("6");
    }

    else {
      console.log("8");
      var obj = Object.assign({}, this.partyObj);
      obj['login_user_id'] = obj['contact_phone'] + "-" + obj['contact_email'];
      obj['user_id'] = this.erpUser.user_id;

      console.log(obj)
      if (this.next_button_2 == false) {
        this.spinner.show()

        var resp = await this.emb_mainService.createLegalEntity(obj);
        console.log(resp)
        if (resp['error'] == false) {
          this.spinner.hide()

          this.partyObj['le_id'] = resp['data']
          this.next_button_2 = true
        } else {
          this.spinner.hide()
          if (resp['data'] == "Duplicate entry") {
            swal.fire('Error...', 'Either Mobile Or Email Is Already Exists.', 'error')
          } else {
            swal.fire('Error', 'Error While Creating', 'error')
          }
        }
      }

    }
  }


  async finalAdd() {

    this.post_data.push({
      party_legal_name: this.partyObj['party_legal_name'],
      le_id: this.partyObj['le_id'],
      party_origination_source_code: this.partyObj['party_origination_source_code'],
      party_type_code: this.partyObj['party_type_code'],
      party_phone_no: this.partyObj['party_phone_no'],
      party_email: this.partyObj['party_email'],
      party_city: this.partyObj['party_city'],
      credential: this.partyObj['credential'],
      party_name: this.partyObj['party_name'],
      party_dob: this.partyObj['party_dob'],
      party_adhaar_no: this.partyObj['party_adhaar_no'],
      party_state: this.partyObj['party_state'],
      party_country: this.partyObj['party_country'],
      party_pan_no: this.partyObj['party_pan_no'],
      party_addr_line1: this.partyObj['party_addr_line1'],
      party_addr_line2: this.partyObj['party_addr_line2'],
      effective_date: this.partyObj['effective_date'],
      party_bank_acct_no: this.partyObj['party_bank_acct_no'],
      party_bank_code: this.partyObj['party_bank_code'],
      party_branch_code: this.partyObj['party_branch_code'],
      party_ifsc_code: this.partyObj['party_ifsc_code'],
      party_gst_no: this.partyObj['party_gst_no'],
      create_user_id: this.erpUser.user_id

    })
    this.spinner.show();
    console.log(this.partyObj)
    var obj = Object.assign({}, this.partyObj);
    obj['b_acct_id'] = this.b_acct_id;
    obj['create_user_id'] = this.user_id;
    obj['status'] = "ACTIVE";
    obj['user_id'] = obj['le_id'];
    obj['data'] = this.post_data;
    var today = new Date();
    var ddt = this.partyObj['party_dob'];
    var yr = this.underAgeValidate(today, ddt);

    console.log(obj)

    if (yr >= 18) {
      console.log(obj)
      var resp = await this.settingService.createParty(obj);
      console.log(resp, 'qwertyo')
      if (resp['error'] == false) {

        setTimeout(async () => {
          this.partyObj = {};
          await this.getListOfAllParty();
          await this.open_list();
          this.spinner.hide();
          swal.fire("Huuray", "...and Party Added!", 'success');
        }, 1000);
      } else {

        this.spinner.hide();
        var str = resp.data;
        if (str.includes("Duplicate")) {
          swal.fire("Sorry", resp.data, 'warning');
        } else {
          swal.fire("Sorry", "...There looks some error, it  will be rectify soon!", 'warning');
        }

      }
    } else {
      this.spinner.hide();

      swal.fire("Sorry", "...You are below 18 years!", 'warning');
    }
  }

  errorMsg = ""
  async addParty() {

    console.log(this.partyObj)
    this.errorMsg = ''
    if (this.partyObj['party_phone_no'] == null || this.partyObj['party_phone_no'] == undefined || this.partyObj['party_phone_no'] == ""
      || this.partyObj['party_dob'] == null || this.partyObj['party_dob'] == undefined || this.partyObj['party_dob'] == ""
      || this.partyObj['party_name'] == null || this.partyObj['party_name'] == undefined || this.partyObj['party_name'] == ""
      || this.partyObj['party_email'] == null || this.partyObj['party_email'] == undefined || this.partyObj['party_email'] == ""
    ) {
      swal.fire("Sorry", "... * fields required.....!", 'warning');

    }
    else if (this.partyObj['party_phone_no'].toString().length != 10) {
      swal.fire("Sorry", "...Incorrect Phone Number....!", 'warning');
    }

    else {
      swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Add it!'
      }).then((result) => {
        if (result.value) {
          this.finalAdd()
        }
      })
    }
  }

  planing_arrproj = []

  async listfunc() {
    this.list_flag = true
    this.create_flag = false
    this.update_flag = false;
    await this.getListOfAllParty();

  }

  exitingEmployee
  findEmployeeInAccount() {
    var get = false;
    console.log(this.partyObj);

    if (isNaN(this.partyObj['credential'])) {
      for (let i = 0; i < this.allParty.length; i++) {
        if (this.allParty[i]['party_email'] == this.partyObj['credential']) {
          get = true;
          this.exitingEmployee = this.allParty[i]
          console.log(this.exitingEmployee);
          this.modobj = this.exitingEmployee

        }
      }
    } else {
      for (let i = 0; i < this.allParty.length; i++) {

        if (this.allParty[i]['party_phone_no'] == this.partyObj['credential']) {
          get = true;
          this.exitingEmployee = this.allParty[i];
          console.log(this.exitingEmployee);
          this.modobj = this.exitingEmployee
        }
      }
    }

    console.log(get)
    return get;
  }

  data = []
  disable_flag: boolean = false;
  party_exit: boolean = false;
  dob_blank = true;

  // async search() {
  //   this.disable_flag = false
  //   console.log(this.partyObj);

  //   this.partyObj['party_name'] = null;
  //   this.partyObj['party_email'] = null;
  //   this.partyObj['party_phone_no'] = null;
  //   this.partyObj['party_dob'] = null;
  //   this.partyObj['le_id'] = null;
  //   console.log(this.partyObj['credential'])
  //   if (await this.findEmployeeInAccount()) {
  //     $('#myModal1').modal('show');
  //     return;
  //   }


  //   this.partyObj['b_acct_id'] = this.b_acct_id
  //   console.log(isNaN(this.partyObj['credential']))

  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id
  //   if (isNaN(this.partyObj['credential'])) {
  //     obj['contact_email'] = this.partyObj['credential']
  //     this.partyObj['party_email'] = this.partyObj['credential']
  //   } else {
  //     obj['phone_no'] = this.partyObj['credential']
  //     this.partyObj['party_phone_no'] = this.partyObj['credential']
  //   }

  //   console.log(this.partyObj)
  //   if (!this.partyObj['credential']) {
  //     swal.fire('Error', 'Please Enter Valid Credential', 'error')
  //   } else {
  //     this.spinner.show()
  //     var resp = await this.MD_mainService.getCurrentLegalEntity(JSON.stringify(obj));
  //     console.log(resp)
  //     if (resp['error'] == false) {
  //       this.spinner.hide();
  //       this.data = resp['data']
  //       if (resp['data'].length > 0) {

  //         if (resp['data'][0]['party_type_code'] == 'ORG') {
  //           this.spinner.hide();
  //           swal.fire('Error', 'Please Enter Valid Legal Entity Not Org..', 'error');
  //           return;

  //         }

  //         this.disable_flag = true;
  //         this.party_exit = true;
  //         this.partyObj['party_name'] = resp['data'][0]['party_name']
  //         this.partyObj['party_email'] = resp['data'][0]['contact_email']
  //         this.partyObj['party_phone_no'] = resp['data'][0]['phone_no']
  //         this.partyObj['le_id'] = resp['data'][0]['le_id'];
  //         this.partyObj['le_id'] = resp['data'][0]['le_id'];
  //         if (resp['data'][0]['party_dob'] != null) {
  //           this.dob_blank = false;
  //           this.partyObj['party_dob'] = resp['data'][0]['party_dob'].split('T')[0];
  //         } else {
  //           this.dob_blank = true;

  //         }
  //         this.partyObj['new_entity'] = false;
  //         this.partyObj['ident_verify_secret'] = 'User@1';
  //         Swal.fire('Warning...', 'A person with searched email/phone number is already available. Following are the details for this person. If you want to add this person as employee then you can continue by clcking "next". If this is not the person that you wanted to add then please click "Back" and search using different phone and/or email.', 'warning')

  //       } else {
  //         this.party_exit = false;
  //         this.dob_blank = true;

  //         this.partyObj['new_entity'] = true;
  //         this.partyObj['ident_verify_secret'] = 'User@1';
  //         this.partyObj['party_type_code'] = "IND";
  //         this.spinner.hide()
  //         Swal.fire('Warning...', 'No person was found with searched email/phone in our system,please fill the details to create identity for the employee that you want to add', 'warning')
  //       }
  //     } else {
  //       this.spinner.hide()
  //       swal.fire('Error', 'Some Error Occured', 'error')
  //     }
  //   }
  //   this.stepper1.next();
  //   console.log(resp);
  // }

  async open_list() {
    this.list_flag = true
    this.create_flag = false
    this.update_flag = false
    this.partyObj = {};
  }

  async getListOfAllParty() {
    console.log("All Emoplyee")
    this.spinner.show();
    this.allParty = []
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.settingService.getPartyInfo(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allParty = resp.data
      console.log(this.allParty)
      this.datasource = new MatTableDataSource(this.allParty)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      this.spinner.hide()
    } else {
      this.spinner.hide();
      swal.fire('Error', 'Some Error Occured', 'error')
    }
  }

  async inactiveParty(element) {
    this.spinner.show()
    this.allParty = []
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    // obj['emp_id'] = element.emp_id;
    var resp = await this.settingService.inActiveParty(obj);
    if (resp['error'] == false) {
      setTimeout(async () => {
        // await this.getAllParties();
        await this.getListOfAllParty();
        this.spinner.hide()
        Swal.fire('Success', 'Inactive Successfully', 'success')
      }, 1000);
    } else {
      this.spinner.hide();
      swal.fire('Error', 'Some Error Occured', 'error')
    }
  }



  async activeParty(element) {
    this.spinner.show()
    this.allParty = []
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    // obj['emp_id'] = element.emp_id;
    // obj['id'] = element.emp_line_id;
    var resp = await this.settingService.activeParty(obj);
    if (resp['error'] == false) {
      setTimeout(async () => {
        // await this.getAllParties();
        await this.getListOfAllParty();
        this.spinner.hide()
        Swal.fire('Success', 'Active Successfully', 'success')
      }, 1000);
    } else {
      this.spinner.hide();
      swal.fire('Error', 'Some Error Occured', 'error')
    }
  }

}
