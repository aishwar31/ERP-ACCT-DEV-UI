import { Component, OnInit, ViewChild } from '@angular/core';

import { AllEmpService } from '../../../services/hrms/service/all-emp.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MainService } from '../../service/main.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MainService as md_mainService } from '../../../services/md/service/main.service';

declare var $: any;
 
@Component({
  selector: 'app-Accounts-users',
  templateUrl: './Accounts-users.component.html',
  styleUrls: ['./Accounts-users.component.css']
})
export class AccountsUsersComponent implements OnInit {
  displayedColumns: string[] = ['user_id', 'name', 'phone_no', 'email', 'role_desc', 'action'];
  email;
  password;
  confirm_pass;
  users = [];
  datasource;
  user_id;
  index;
  Obj = {};
  FirstName;
  LastName;
  User_Email;
  b_acct_id;
  ebillUser
  constructor(private spinner: NgxSpinnerService, private allEmpService: AllEmpService, public mainService: md_mainService, public toastr: ToastrManager, private sanitizer: DomSanitizer, public mainServices: MainService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  async ngOnInit() {
    this.ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.ebillUser.b_acct_id
    await this.getCurrentLegalEntity()
    await this.getCurrentRole()
    await this.getCurrentUsers()
    await this.getAllEmployees()
  }

  single_users_role = []
  selected_row = {}
  modalOpen(data) {
    this.selected_row = {}
    this.selected_row = Object.assign({}, data)
    this.single_users_role = []
    let dummy = []
    // dummy.push(data)
    for (let i = 0; i < this.allUsers.length; i++) {
      if (data['user_id'] == this.allUsers[i]['user_id']) {
        dummy.push(this.allUsers[i])
      }
    }
    for (let i = 0; i < dummy.length; i++) {
      for (let j = 0; j < this.current_role.length; j++)
        if (dummy[i]['role_cd'] == this.current_role[j]['role_cd']) {
          dummy[i]['role_desc'] = this.current_role[j]['role_desc']
        }
    }
    this.single_users_role = dummy
    console.log(data, this.allUsers,this.current_role,dummy)

    $('#myModal1').modal('show');

  }
  async delete(element) {
    console.log(element)
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.value) {
        this.finaldelete(element)
      }
    })
  }
  async finaldelete(element) {
    let obj = {}
    obj = Object.assign({}, element)
    obj['b_acct_id'] = this.b_acct_id
    this.spinner.show()
    var resp = await this.mainService.deleteUser_MD(obj)
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide()
      await this.getCurrentUsers()
      await this.modalOpen(this.selected_row)
      Swal.fire('Success', 'Deleted Successfully', 'success')
    } else {
      this.spinner.hide()
      Swal.fire('Error', resp['data'], 'error')
    }
  }
  getNumberFormat(num) {
    return num.toString().padStart(3, "0")
  }
  allEmplyees_new = []
  allEmployees = []
  allSearchableEmp = []
  obj_emp={}
  async getAllEmployees() {
    console.log('all emp')
    this.spinner.show()
    var arr = []
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['module_cd'] = 'ACCOUNT'
    var resp = await this.mainService.getuserformodulerolemapping(JSON.stringify(obj));
    console.log(resp,'all roles')
    if (resp['error'] == false){
      this.allSearchableEmp = resp['data']
      for (let i = 0; i < this.allSearchableEmp.length; i++) {
        this.allSearchableEmp[i]['desc'] = this.allSearchableEmp[i]['user_id'] + " - " + this.allSearchableEmp[i]['emp_name'] + " - " + this.allSearchableEmp[i]['emp_phone_no']
      }
      this.spinner.hide()
      arr = resp.data;
      // for (let i = 0; i < arr.length; i++) {
      //   var obj = new Object();
      //   obj = Object.assign({}, arr[i]);
      //   obj['tempid'] = this.mainService.accInfo['account_short_name'] + this.getNumberFormat(obj['emp_id'])
      //   this.allEmployees.push(obj)
      // }
      // this.allEmplyees_new = [];
      // for (let i = 0; i < resp.data.length; i++) {
      //   var obj = new Object();
      //   obj = Object.assign({}, resp.data[i]);
      //   obj['emp_name'] = this.mainService.accInfo['account_short_name'] + this.getNumberFormat(obj['emp_id']) + "-" + obj['emp_name']
      //   this.allEmplyees_new.push(obj)
      // }
      // for (let i = 0; i < arr.length; i++) {
      //   for (let j = 0; j < this.current_LE.length; j++) {
      //     if (this.current_LE[j]['phone_no'] == arr[i]['emp_phone_no']) {
      //       arr[i]['le_id'] = this.current_LE[j]['le_id']
      //     }
      //   }
      // }
      // this.allSearchableEmp = arr
      console.log(this.allSearchableEmp,'allSearchableEmp')
    } else {
      this.spinner.hide()
      // this.snackBar.open("Error while getting employee list" ,'Error',{
      //   duration:5000
      // });
    }
    console.log(this.allEmployees, this.allEmplyees_new, this.current_LE, arr, 'employees')
  }
  current_role = []
  async getCurrentRole() {
    this.spinner.show()
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id
    obj['module_cd']='ACCOUNT'
    console.log(obj)
    var resp = await this.mainService.getCurrentMdRole(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.current_role = resp['data']
      console.log(resp);
    } else {
      this.spinner.hide()
      Swal.fire("Error", "..Error while getting  roles", 'error');
    }
  }
  allUsers = []
  async getCurrentUsers() {
    console.log('called this funnction')
    this.spinner.show()
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id;
    obj['module_cd'] = 'ACCOUNT'
    console.log(obj)
    var resp = await this.mainService.getCurrentMdUser(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.allUsers=resp['data']
      this.spinner.hide()
      var emp_id = new Object();
      for (let i = 0; i < resp['data'].length; i++) {
        for (let j = 0; j < this.current_role.length; j++) {
          if (this.current_role[j]['role_cd'] == resp['data'][i]['role_cd']) {
            if (emp_id[resp['data'][i]['user_id']] == undefined) {
              resp['data'][i]['role_name'] = this.current_role[j]['role_name']
              emp_id[resp['data'][i]['user_id']] = resp['data'][i]
            } else {
              emp_id[resp['data'][i]['user_id']]['role_name'] = emp_id[resp['data'][i]['user_id']]['role_name'] + " , " + this.current_role[j]['role_name']
            }
          }
        }
      }
      console.log(emp_id)
      var data = Object.values(emp_id);
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.current_LE.length; j++) {
          if (this.current_LE[j]['le_id'] == data[i]['user_id']) {
            data[i]['party_name'] = this.current_LE[j]['party_name']
            data[i]['contact_email'] = this.current_LE[j]['contact_email']
            data[i]['phone_no'] = this.current_LE[j]['phone_no']
          }
        }
      }
      console.log(data)
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    } else {
      this.spinner.hide()
      Swal.fire("Error", "..Error while getting  roles", 'error');
    }
  }
  current_LE = []
  ind_current_LE = []
  org_current_LE = []
  async getCurrentLegalEntity() {
    this.current_LE = []
    this.ind_current_LE = []
    this.org_current_LE = []
    var resp = await this.mainService.getCurrentLegalEntity(this.b_acct_id);
    console.log(resp);
    if (resp['error'] == false) {
      console.log(resp);
      this.current_LE = resp['data']
      let ind = []
      let org = []
      for (let i = 0; i < this.current_LE.length; i++) {
        if (this.current_LE[i]['party_type'] == 'IND') {
          ind.push(this.current_LE[i])
        } else {
          org.push(this.current_LE[i])
        }
      }
      this.ind_current_LE = ind
      this.org_current_LE = org
    } else {
      Swal.fire("Error", "..Error while getting current Legal Entity", 'error');
    }
  }
  setDetails() {
    if (this.Obj['user_id']) {
      for (let i = 0; i < this.allSearchableEmp.length; i++) {
        if (this.Obj['user_id'] == this.allSearchableEmp[i]['le_id']) {
          this.Obj['name'] = this.allSearchableEmp[i]['emp_name']
          this.Obj['email'] = this.allSearchableEmp[i]['emp_email']
          this.Obj['phone'] = this.allSearchableEmp[i]['emp_phone_no']
          this.Obj['user_id'] = this.allSearchableEmp[i]['le_id']
          this.Obj['allow_create'] = 'YES' // let flag
          console.log(this.allSearchableEmp[i])
          break;
        }
      }
    } else {
      this.Obj['name'] = null
      this.Obj['email'] = null
      this.Obj['phone_no'] = null
    }
  }
  open_update(element) {
    this.Obj = element;
    $('.nav-tabs a[href="#tab-7-3"]').tab('show');
  }

  async update() {

  }

  account





 

  email_Validate(emailAdress) {
    var EMAIL_REGEXP = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
    return EMAIL_REGEXP.test(emailAdress)
  }
  CheckPassword(inputtxt) {
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (passw.test(this.Obj['password'])) {
      return true;
    }
    else {
      return false;
    }
  }
  data = []
  async search() {
    let flag = false
    this.spinner.show()
    this.Obj['name'] = null
    this.Obj['email'] = null
    this.Obj['phone_no'] = null
    console.log(this.allSearchableEmp)
    if (this.Obj['credential']) {
      for (let i = 0; i < this.allSearchableEmp.length; i++) {
        if (this.Obj['credential'] == this.allSearchableEmp[i]['emp_phone_no']) {
          this.Obj['name'] = this.allSearchableEmp[i]['emp_name']
          this.Obj['email'] = this.allSearchableEmp[i]['emp_email']
          this.Obj['phone'] = this.allSearchableEmp[i]['emp_phone_no']
          this.Obj['user_id'] = this.allSearchableEmp[i]['le_id']
          this.Obj['allow_create'] = 'YES' // let flag
          flag = true
          this.spinner.hide()
          break
        } else {
          let flag = false
          this.spinner.hide()
          this.Obj['name'] = null
          this.Obj['email'] = null
          this.Obj['phone'] = null
          this.Obj['user_id'] = null
          this.Obj['phone_no'] = null
        }
      }
    } else {
      Swal.fire('Error', 'Please Enter Valid Mobile Number', 'error')
      this.spinner.hide()
      this.Obj['name'] = null
      this.Obj['email'] = null
      this.Obj['phone'] = null
      this.Obj['user_id'] = null
      this.Obj['phone_no'] = null
    }
    if (flag == false) {
      Swal.fire('Error', 'This Mobile Number`s Record Not Found', 'error')

    }
  }

  async submit() {
    console.log('yes....')
    console.log(this.Obj)
    if (!this.Obj['user_id']) {
      Swal.fire('Error', 'Please Select User', 'error')
    } else if (!this.Obj['role_cd']) {
      Swal.fire('Error', 'Please Select Role', 'error')
    } else {
      console.log(this.Obj)
      this.Obj['b_acct_id'] = this.b_acct_id
      this.Obj['valid_upto'] = '2030-04-30'
      this.Obj['module_cd']='ACCOUNT'
      this.spinner.show()
      var resp = await this.mainService.createMdUser(this.Obj)
      console.log(resp)
      if (resp['error'] == false) {
        setTimeout(() => {
          this.spinner.hide()
          Swal.fire('Success...', 'Created Successfully', 'success')
          this.getCurrentUsers()
        }, 500);
      } else {
        this.spinner.hide()
        if (resp['data'] == "Duplicate entry") {
          Swal.fire('Error...', 'This User Is Already Exists.', 'error')
        } else {
          Swal.fire('Error', 'Error While Creating', 'error')
        }

      }
    }
  }
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  refresh() {
    this.Obj = {}
    this.data = []
  }


}
