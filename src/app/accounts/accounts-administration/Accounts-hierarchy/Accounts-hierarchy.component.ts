import { Component, OnInit, ViewChild } from '@angular/core';

import { AdministrationService } from '../../service/administration.service';
import { EmbHierService } from '../../../services/emb/service/emb-hier.service';
import { MainService } from '../../service/main.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

declare var $: any;



 
@Component({
  selector: 'app-Accounts-hierarchy',
  templateUrl: './Accounts-hierarchy.component.html',
  styleUrls: ['./Accounts-hierarchy.component.css']
})
export class AccountsHierarchyComponent implements OnInit {

 
  ebillUser;
  b_acct_id;
  Obj = {}
  ActiveNode = [];


  access=[]
  allRoles = [];
  allComp;
  selectedComp = [];
  dataSource;
  role_name;
  role_id;



  displayedColumns: string[] = ['node_cd', 'node_desc', 'level', 'path', 'status', 'is_leaf', 'action'];
  constructor(private embHierService: EmbHierService,private adminstration_S:AdministrationService, private spinner: NgxSpinnerService, public mainServices: MainService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.ebillUser.b_acct_id;
    await this.getAllHeirNodeList();
    console.log(this.ActiveNode)
  }

  NodeCodeToNodeDesc = {};

  async getAllHeirNodeList() {
    this.spinner.show();
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    console.log(obj)
    var resp = await this.adminstration_S.getAllHrHierarchy(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide()
      console.log(resp['data']);
      this.ActiveNode = [];
      this.NodeCodeToNodeDesc = {};
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['status'] == 'ACTIVE' && resp.data[i]['is_leaf'] == 0) {
          resp['data'][i]['desc'] = resp['data'][i]['node_cd'] + " - " + resp['data'][i]['node_desc'];
          this.ActiveNode.push(resp.data[i])
        }
        this.NodeCodeToNodeDesc[resp['data'][i]['node_cd']] = resp['data'][i]
      }

      console.log(this.ActiveNode);
      this.dataSource = new MatTableDataSource(resp['data'])
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.spinner.hide()
      Swal.fire('Error...', 'Error While HR HIER', 'error')
    }
  }

  ParentNodeChange() {
    console.log(this.Obj);
    if (this.Obj['parent_node_cd'] != null || this.Obj['parent_node_cd'] != undefined) {
      var dd = this.NodeCodeToNodeDesc[this.Obj['parent_node_cd']]['path'].split("|");
      var str = ''
      for (let i = 0; i < dd.length; i++) {
        str = str + this.NodeCodeToNodeDesc[dd[i]]['node_desc'] + " -> "
      }
      this.Obj['path_desc'] = str;
    } else {
      this.Obj['path_desc'] = null;
    }
  }

  // flag = false
  // open_update(element) {
  //   this.Obj = Object.assign({}, element)
  //   this.Obj['res_cd'] = this.Obj['res_cd'].split(",")
  //   this.flag = false
  //   if (this.Obj['role_cd'] == 'AA' || this.Obj['role_cd'] == 'ZA') {
  //     this.flag = true;
  //     this.Obj['res_cd'] = []
  //     for (let i = 0; i < this.allResources.length; i++) {
  //       this.Obj['res_cd'].push(this.allResources[i]['res_cd'])
  //     }
  //   }

  //   $('.nav-tabs a[href="#tab-7-4"]').tab('show');
  // }
  async inactive(element) {

      this.spinner.show();
      var obj=Object.assign({},element)
      obj['b_acct_id'] = this.b_acct_id
      obj['update_user_id'] = this.ebillUser.user_id;
      obj['status'] = 'INACTIVE';
      console.log(obj)
      var resp = await this.adminstration_S.updateHrHierarchyNode(obj);
      console.log(resp)
      if (resp['error'] == false) {
        this.spinner.hide();
        await this.getAllHeirNodeList();
        Swal.fire("Success", "... Node InActive", 'success');

      }
      else {
        this.spinner.hide();
        Swal.fire('Error...', 'Some Error Occured', 'error');
      }
   
  }
  async submit() {

    if (this.Obj['node_cd']) {

      // this.spinner.show()
      this.Obj['b_acct_id'] = this.b_acct_id
      this.Obj['create_user_id'] = this.ebillUser.user_id;
      this.Obj['is_leaf'] = 0
      this.Obj['status'] = 'ACTIVE';
      this.Obj['level']=this.NodeCodeToNodeDesc[this.Obj['parent_node_cd']]['level']+1;
      this.Obj['path']=this.NodeCodeToNodeDesc[this.Obj['parent_node_cd']]['path']+"|"+this.Obj['node_cd'];


      console.log(this.Obj)
      var resp = await this.adminstration_S.insertHrHierarchyNode(this.Obj);
      if (resp['error'] == false) {
        this.spinner.hide();
        await this.getAllHeirNodeList();
        Swal.fire("Successfully Created", "... New node", 'success');
      }
      else {
        this.spinner.hide();
        Swal.fire('Error...', 'Error While Create A New Node..', 'error');
      }
    } else {
      Swal.fire('Warning...', 'Please Enter All Fields Marked As *', 'warning')
    }
  }
 
  // async getAllRoles(b_acct_id) {
  //   var resp = await this.userService.getAllRoles(b_acct_id);
  //   if (resp['error'] == false) {
  //     this.allRoles = resp.data;
  //   }
  // }
  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // clickUpdate(element, j) {
  //   var ids = element.interface_id.split(',');
  //   var newIds = [];
  //   for (var i = 0; i < ids.length; i++) {
  //     newIds.push(parseInt(ids[i]));
  //   }
  //   this.selectedComp = newIds;
  //   this.role_name = element.role_name;
  //   this.role_id = element.role_id;

  // }
  // async addNewRole() {
  //   this.spinner.show();
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   obj['interface_id'] = this.selectedComp;
  //   obj['role_name'] = this.role_name;
  //   var resp = await this.userService.addNewRole(obj);
  //   if (resp['error'] == false) {
  //     await this.getAllRoles(this.b_acct_id);
  //     this.spinner.hide();
  //     this.toastr.successToastr('Added Successfully', 'Success!');
  //   } else {
  //     this.spinner.hide();
  //     this.toastr.errorToastr(resp['data'], 'Oops!');
  //   }
  // }


  // async  deleteRole(element, i) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Delete'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.finaldelete(element, i)
  //     }
  //   })
  // }

  // async finaldelete(element, i) {
  //   var obj=new Object();
  //   obj['b_acct_id']=this.b_acct_id;
  //   obj['role_cd']=element['role_cd']

  //   console.log(obj);
  //   if(element['role_cd']=='AA' || element['role_cd']=='ZA'){
  //     this.toastr.errorToastr('You can not delete this System Role.....', 'Oops!');
  //     return;
  //   }
  //   this.spinner.show();
  //   var resp = await this.userService.deleteUnUsedRole(obj);
  //   if (resp['error'] == false) {
  //     this.allRoles.splice(i, 1);
  //     this.dataSource = new MatTableDataSource(this.allRoles);
  //     this.dataSource.paginator = this.paginator;

  //     this.dataSource.sort = this.sort;
  //     this.spinner.hide();
  //     this.toastr.successToastr('Deleted Successfully', 'Success!');
  //   } else {
  //     this.spinner.hide();
  //     this.toastr.errorToastr(resp['data'], 'Oops!');
  //   }

  // }
  // async updateRole() {
  //   this.spinner.show();
  //   var obj = new Object();
  //   obj['role_id'] = this.role_id;
  //   obj['interface_id'] = this.selectedComp;
  //   obj['role_name'] = this.role_name;
  //   var resp = await this.userService.updateRole(obj);
  //   if (resp['error'] == false) {
  //     await this.getAllRoles(this.b_acct_id);
  //     this.spinner.hide();
  //     this.toastr.successToastr('Updated Successfully', 'Success!');
  //   } else {
  //     this.spinner.hide();
  //     this.toastr.errorToastr(resp['data'], 'Oops!');
  //   }
  // }

}
