import { Component, OnInit, ViewChild } from '@angular/core';

import {MainService} from '../../service/main.service'
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
  selector: 'app-Accounts-roles',
  templateUrl: './Accounts-roles.component.html',
  styleUrls: ['./Accounts-roles.component.css']
})
export class AccountsRolesComponent implements OnInit {
  checkBoxValue: any = false;
  displayedColumns = ['role_cd', 'role_name', 'role_desc', 'role_type','res','action'];
  type_data = []
  party = [];
  datasource;
  user_id;
  index;
  Obj = {};
  b_acct_id = 0;
  erpUser;
  le_type = []
  allCodeValue = [];

  list_flag = true
  create_flag = false
  update_flag = false

  constructor(private spinner: NgxSpinnerService, public toastr: ToastrManager, private mainService: md_mainService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  data = [{ id: 1, acct_short_name: 'AC', acct_full_name: 'Account', name: "suraj kumar", email: "suraj@infiniseasoft.com", phone_no: "9984904063" }]
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id
    await this.getCurrentResource()
    await this.getcurrentroleswithresources()
    // await this.getAllModules()
  }
  checkCheckBoxvalue() {
    let dummy = []
    if (this.checkBoxValue == false) {
      for (let i = 0; i < this.resource.length; i++) {
        dummy.push(this.resource[i]['resource_cd'])
      }
      this.Obj['res'] = dummy
    } else {
      this.Obj['res'] = null
    }
    console.log(this.checkBoxValue, this.Obj)
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
    var resp = await this.mainService.deleteRole(obj)
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide()
      await this.getcurrentroleswithresources()
      Swal.fire('Success', resp['data'], 'success')
    } else {
      this.spinner.hide()
      Swal.fire('Error', resp['data'], 'error')
    }
  }
  async getcurrentroleswithresources() {
    this.spinner.show()
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id
    obj['module_cd']='ACCOUNT'
    console.log(obj)
    var resp = await this.mainService.getcurrentroleswithresources(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.spinner.hide()
      var data=[];
      for(let i=0;i<resp.data.length;i++){
        // if(resp.data[i]['is_system_role']==0){
          data.push(resp.data[i])
        // }
      }
      console.log(data);
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    } else {
      this.spinner.hide()
      Swal.fire("Error", "..Error while getting  roles", 'error');
    }
  }

  resource = []
  async getCurrentResource() {
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id
    var resp = await this.mainService.getMdResource(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      console.log(resp);
      let dummy = []
      for (let i = 0; i < resp['data'].length; i++) {
        if (resp['data'][i]['module_cd'] == 'ACCOUNT') {
          resp['data'][i]['desc']=resp['data'][i]['module_cd']+" - "+resp['data'][i]['resource_desc']
          dummy.push(resp['data'][i])
        }
      }
      this.resource = dummy
      console.log(this.resource, 'rrrrrrrrrrrrrrrrrr')
    } else {
      Swal.fire("Error", "..Error while getting  resource", 'error');
    }
  }


  viewObj = {}
  viewDetails(element) {
    this.viewObj = Object.assign({}, element)
    console.log(element)
    $('#B').modal('show');
  }

  changeparty() {
    for (let i = 0; i < this.party.length; i++) {
      if (this.party[i]['party_id'] == this.Obj['party_id']) {
        this.Obj['party_leagal_name'] = this.party[i]['party_leagal_name']
      }
    }
  }

  async refresh() {
    this.Obj = {}
  }

  back() {
    $('.nav-tabs a[href="#tab-7-1"]').tab('show');
    this.Obj = {};
  }

  async open_update(element) {
    this.list_flag = false
    this.create_flag = false
    this.update_flag = true
    console.log(element)
    this.spinner.show();
    this.Obj = Object.assign({}, element);
    this.Obj['old_role_cd'] = element['role_cd']
    // await this.set_flag()
    if (element['resource_cd']) {
      this.Obj['res'] = element['resource_cd'].split(',')
    }
    // if (this.Obj['role_type'] == 'Account Admin') {
    //   this.resource2 = this.resource
    // } else {
    //   let dummy = []
    //   for (let i = 0; i < this.resource.length; i++) {
    //     if (this.Obj['module_cd'] == this.resource[i]['module_cd']) {
    //       dummy.push(this.resource[i])
    //     }
    //   }
    //   this.resource2 = dummy
    // }

    // console.log(this.Obj, this.resource2, this.resource)
    // this.check_flag=true
    $('.nav-tabs a[href="#tab-7-3"]').tab('show');
    this.spinner.hide();
  }

 

  async submit() {
    if (!this.Obj['role_cd']) {
      Swal.fire("Error", 'Please Enter Role Code', 'error')
    } else if (!this.Obj['role_name']) {
      Swal.fire('Error', 'Please Enter Role Description', 'error')
    }
    else if (!this.Obj['role_desc']) {
      Swal.fire('Error', 'Please Enter Role Description', 'error')
    }
     else if (!this.Obj['res']) {
      Swal.fire('Error', 'Please Select Resource', 'error')
    } 
    else {
      let dummy = []
      for (let i = 0; i < this.resource.length; i++) {
        for (let j = 0; j < this.Obj['res'].length; j++) {
          if (this.Obj['res'][j] == this.resource[i]['resource_cd']) {
            dummy.push(this.resource[i])
          }
        }
      }
      this.Obj['b_acct_id'] = this.b_acct_id
      this.Obj['life_cycle_status'] = 'GENERATED'
      this.Obj['user_id'] = this.erpUser.le_id
      this.Obj['role_type']='Module Role'
      this.Obj['data'] = dummy
      this.Obj['module_cd']='ACCOUNT'
      console.log(this.Obj)
      this.spinner.show()
      var resp = await this.mainService.createMdRole(this.Obj);
      console.log(resp)
      if (resp['error'] == false) {
        setTimeout(()=>{ 
          this.spinner.hide()
          Swal.fire('Success...', 'Created Successfully', 'success')
           this.getcurrentroleswithresources()
        }, 500);
      } else {
        this.spinner.hide()
        Swal.fire('Error', resp['data'], 'error')
      }
    }
  }
  async update() {
    if (!this.Obj['role_cd']) {
      Swal.fire("Error", 'Please Enter Role Code', 'error')
    } else if (!this.Obj['role_name']) {
      Swal.fire('Error', 'Please Enter Role Description', 'error')
    }
    else if (!this.Obj['role_desc']) {
      Swal.fire('Error', 'Please Enter Role Description', 'error')
    }
     else if (!this.Obj['res']) {
      Swal.fire('Error', 'Please Select Resource', 'error')
    } 
    else {
      let dummy = []
      for (let i = 0; i < this.resource.length; i++) {
        for (let j = 0; j < this.Obj['res'].length; j++) {
          if (this.Obj['res'][j] == this.resource[i]['resource_cd']) {
            dummy.push(this.resource[i])
          }
        }
      }
      this.Obj['b_acct_id'] = this.b_acct_id
      this.Obj['life_cycle_status'] = 'GENERATED'
      this.Obj['user_id'] = this.erpUser.le_id
      this.Obj['role_type']='Module Role'
      this.Obj['data'] = dummy
      this.Obj['module_cd']='ACCOUNT'
      console.log(this.Obj)
      this.spinner.show()
      var resp = await this.mainService.updateRole(this.Obj);
      console.log(resp)
      if (resp['error'] == false) {
        setTimeout(()=>{ 
          this.spinner.hide()
          Swal.fire('Success...', 'Update Successfully', 'success')
           this.getcurrentroleswithresources()
        }, 500);
      } else {
        this.spinner.hide()
        Swal.fire('Error', 'Error While Creating', 'error')
      }
    }
  }

  validate(email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email) == false) {
      return (false);
    } else {
      return true
    }
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  open_create() {

    this.list_flag = false
    this.create_flag = true
    this.update_flag = false
  }

  async open_list() {
    this.list_flag = true
    this.create_flag = false
    this.update_flag = false
    
  }

}
