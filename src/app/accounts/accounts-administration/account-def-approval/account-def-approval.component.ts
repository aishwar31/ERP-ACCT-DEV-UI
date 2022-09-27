import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MainService as mainServiceAdmin } from '../../../services/admin/service/main.service';
import { MainService as mainServiceMd } from '../../../services/md/service/main.service';

declare var $: any;



 
@Component({
  selector: 'app-account-def-approval',
  templateUrl: './account-def-approval.component.html',
  styleUrls: ['./account-def-approval.component.css']
})



export class AccountDefApprovalComponent implements OnInit {

  constructor(public mainServiceAdmin: mainServiceAdmin, public mainServiceMd: mainServiceMd, private spinner: NgxSpinnerService, private toastr: ToastrManager) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  doc_type = [{ value: 'CB' }, { value: 'JV' }]
  logicalCondition = [{ value: 'AND' }, { value: 'OR' }]
  roleFunction = [{ code: 'Forward', value: 'Forward' }, { code: 'Down Marking', value: 'Down Marking' },
  { code: 'Approval', value: 'Approval' }, { code: 'Payment', value: 'Payment' }, { code: 'Info', value: 'Info' }]
  successAction = [{ code: 'Approve & Forward', value: 'Approve & Forward' }, { code: 'Down Mark for Approval', value: 'Down Mark for Approval' }, { code: 'Approve', value: 'Approve' },
  { code: 'Note & Forward', value: 'Note & Forward' }, { code: 'Email', value: 'Email' }, { code: 'SMS', value: 'SMS' }]
  displayedColumns = ['id', 'doc_type', 'module_cd', 'action'];
  datasource;
  mainService = {}
  FlowObj = { data: [] }
  erpUser
  b_acct_id;


  isLinear = false;
  first = true;
  second = true;
  third = true;

  // checked=false;

  allModule = [];
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getAllModule();
    await this.getRoles();
    await this.getAllActiveWorkFlow();
  }


  async getAllActiveWorkFlow() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['status'] = 'ACTIVE'
    var resp = await this.mainServiceMd.getdistinctDocumentWorkflows(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data)
      var data = [];

      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['module_cd'] == 'ACCOUNT') {
          data.push(resp.data[i])
        }
      }
      this.datasource = new MatTableDataSource(data)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    }
  }


  roles = []
  allRoles = [];
  allRolesForEMB = []
  async getRoles() {
    var resp = await this.mainServiceMd.getApprovalroles(JSON.stringify({ b_acct_id: this.b_acct_id }));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data);
      this.roles = resp.data
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['module_cd'] == 'ACCOUNT') {
          this.allRolesForEMB.push(resp.data[i])
        } else {
          this.allRoles.push(resp.data[i])
        }
      }

    }
  };
  Module = [];
  allModuleForEMB = []
  async getAllModule() {
    var obj = new Object();
    obj['b_acct_id'] = 0;
    var resp = await this.mainServiceMd.getModules(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data)
      var AdminModule = resp.data;
      var assignedModule = this.erpUser.assigned_product_cd;

      for (let i = 0; i < AdminModule.length; i++) {
        for (let j = 0; j < assignedModule.length; j++) {
          if (assignedModule[j] == AdminModule[i]['module_cd']) {
            this.Module.push(AdminModule[i])
            if (AdminModule[i]['module_cd'] == 'ACCOUNT') {
              this.allModuleForEMB.push(AdminModule[i])
            } else {
              this.allModule.push(AdminModule[i])
            }
          }
        }
      }
      console.log(this.allModule)
    }
  };


  refresh() {
    this.moduledata = [];
    this.crossmoduledata1 = [];
    this.Apprmoduledata = [];
  }



  //for module
  moduledata = [];

  addRowLevelForModule() {
    this.moduledata.push({
      level: this.moduledata.length + 1,
      branch_data: [{
        level: this.moduledata.length + 1, branch: 1, branch_logical_condition: '', module_role: '', role_cd: '',
        role_function: '', success_action: '', condition_exists: false, sent_to_vendor: false, all_user_approval_req: false,
        data: []
      }]
    });
  }

  addRowBranchForModule(i, j) {
    this.moduledata[i]['branch_data'].push({
      level: i + 1,
      branch: this.moduledata[i]['branch_data'].length + 1, branch_logical_condition: '', module_role: '', role_cd: '',
      role_function: '', success_action: '', condition_exists: false, sent_to_vendor: false, all_user_approval_req: false, data: []
    });
  }


  //for crooss-module

  crossmoduledata1 = [];


  addCrossModule() {
    this.crossmoduledata1.push({
      module: this.moduledata.length + this.crossmoduledata1.length + 1,
      module_show: true,
      level_data: [
        {
          level: this.moduledata.length + 1 + this.crossmoduledata1.length + 0.1,
          branch_data: [{
            level: this.moduledata.length + 1 + this.crossmoduledata1.length + 0.1, branch: 1, branch_logical_condition: '', module_role: '', role_cd: '',
            role_function: '', success_action: '', condition_exists: false, sent_to_vendor: false, all_user_approval_req: false,
            data: []
          }]
        }
      ]
    });
  }
  addLevel(module) {
    for (let i = 0; i < this.crossmoduledata1.length; i++) {
      if (this.crossmoduledata1[i]['module'] == module) {
        this.crossmoduledata1[i]['level_data'].push({
          level: (module + (this.crossmoduledata1[i]['level_data'].length + 1) * (0.10)),
          branch_data: [{
            level: (module + (this.crossmoduledata1[i]['level_data'].length + 1) * (0.10)), branch: 1, branch_logical_condition: '', module_role: '', role_cd: '',
            role_function: '', success_action: '', condition_exists: false, sent_to_vendor: false, all_user_approval_req: false,
            data: []
          }]
        })
      }
    }
  }
  addBranch(module, level) {
    for (let i = 0; i < this.crossmoduledata1.length; i++) {
      if (this.crossmoduledata1[i]['module'] == module) {

        for (let j = 0; j < this.crossmoduledata1[i]['level_data'].length; j++) {

          if (this.crossmoduledata1[i]['level_data'][j]['level'] == level) {

            this.crossmoduledata1[i]['level_data'][j]['branch_data'].push({
              level: level, branch: this.crossmoduledata1[i]['level_data'][j]['branch_data'].length + 1, branch_logical_condition: '', module_role: '', role_cd: '',
              role_function: '', success_action: '', condition_exists: false, sent_to_vendor: false, all_user_approval_req: false,
              data: []
            })
          }
        }
      }
    }

  }

  // ****************************Approval Data***************************************************//
  Apprmoduledata = [];
  addRowLevelForApprModule() {
    var lvl = this.moduledata.length + this.crossmoduledata1.length + this.Apprmoduledata.length + 1;

    this.Apprmoduledata.push({
      level: lvl,
      branch_data: [{
        level: lvl, branch: 1, branch_logical_condition: '', module_role: '', role_cd: '',
        role_function: '', success_action: '', condition_exists: false, sent_to_vendor: false, all_user_approval_req: false,
        data: []
      }]
    });
  }

  conditionField = [{ value: 'Bill Amount' }]
  oprater = [{ value: '>' }, { value: '<' }, { value: '>=' }, { value: '<=' }, { value: '==' }, { value: '!=' }]

  updateData = [];
  index_i = 0;
  index_j = 0;

  condtion(i, j) {
    $('#condtion').modal('show');
    this.index_i = i;
    this.index_j = j;
    this.updateData = this.moduledata[i]['branch_data'][j]['data'];
  }


  addConditionRow() {
    this.updateData.push({ selected_field: '', selected_oprater: '', value: 0 })
  }

  deleteConditionRow(i) {
    this.updateData.splice(i, 1)
  }

  saveCondition() {
    this.moduledata[this.index_i]['branch_data'][this.index_j]['data'] = this.updateData;
    this.updateData = [];
    $('#condtion').modal('hide');
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }


  allApproval
  allDocType = []

  changedoctype() {
    for (let i = 0; i < this.allDocType.length; i++) {
      if (this.allDocType[i]['doc_type'] == this.FlowObj['doc_type']) {
        Swal.fire('Warning', 'This document type`s approval hierarchy is already exists..!', 'warning');
      }
    }
  }
  async submit() {
    console.log(this.moduledata);
    console.log(this.crossmoduledata1);
    console.log(this.Apprmoduledata);
    var data = [];
    for (let i = 0; i < this.moduledata.length; i++) {
      var pp = this.moduledata[i]['branch_data']
      for (let j = 0; j < pp.length; j++) {
        pp[j]['department'] = 'MODULE';
        data.push(pp[j])
      }
    }

    for (let i = 0; i < this.crossmoduledata1.length; i++) {
      var level_data = this.crossmoduledata1[i]['level_data']
      for (let j = 0; j < level_data.length; j++) {
        var branch_data = level_data[j]['branch_data']
        for (let k = 0; k < branch_data.length; k++) {
          branch_data[k]['department'] = 'CRROS-MODULE';
          data.push(branch_data[k])
        }
      }
    }

    for (let i = 0; i < this.Apprmoduledata.length; i++) {
      var pp = this.Apprmoduledata[i]['branch_data']
      for (let j = 0; j < pp.length; j++) {
        pp[j]['department'] = 'APPROVAL';
        data.push(pp[j])
      }
    }


    for (let i = 0; i < data.length; i++) {
      if (data[i]['condition_exists']) {
        data[i]['condition_exists'] = 1
      } else {
        data[i]['condition_exists'] = 0
      }

      if (data[i]['sent_to_vendor']) {
        data[i]['sent_to_vendor'] = 1
      } else {
        data[i]['sent_to_vendor'] = 0
      }

      if (data[i]['all_user_approval_req']) {
        data[i]['all_user_approval_req'] = 1
      } else {
        data[i]['all_user_approval_req'] = 0
      }

    }

    console.log(data)
    this.spinner.show();
    this.FlowObj['b_acct_id'] = this.b_acct_id;
    this.FlowObj['data'] = data;
    this.FlowObj['module_cd'] = 'ACCOUNT';
    this.FlowObj['comment'] = 'ACCOUNT ka work Flow';
    this.FlowObj['create_user_id'] = this.erpUser.user_id;
    this.FlowObj['status'] = 'ACTIVE';
    console.log(this.FlowObj)
    var resp = await this.mainServiceMd.createNewWorkflow(this.FlowObj);
    if (resp['error'] == false) {
      this.spinner.hide();
      await this.getAllActiveWorkFlow();

      this.toastr.successToastr('Created Successfully ');
    }
    else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data']);
    }

  }


  async open_update(element) {
    console.log(element);
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['status'] = 'ACTIVE';
    obj['doc_type'] = element['doc_type'];
    obj['module_cd'] = element['module_cd'];
    var resp = await this.mainServiceMd.getWorkflows(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data);
      this.FlowObj['doc_type'] = resp.data[0]['doc_type'];


      var module_data = {}
      var apprval_data = {}
      var cross_module_data = {}
      for (let i = 0; i < resp.data.length; i++) {

        if (resp.data[i]['condition_exists'] == 1) {
          resp.data[i]['condition_exists'] = true
        } else {
          resp.data[i]['condition_exists'] = false
        }

        if (resp.data[i]['sent_to_vendor'] == 1) {
          resp.data[i]['sent_to_vendor'] = true
        } else {
          resp.data[i]['sent_to_vendor'] = false
        }

        if (resp.data[i]['all_user_approval_req'] == 1) {
          resp.data[i]['all_user_approval_req'] = true
        } else {
          resp.data[i]['all_user_approval_req'] = false
        }

        if (resp.data[i]['department'] == 'MODULE') {
          if (module_data[resp.data[i]['level']] == undefined) {
            module_data[resp.data[i]['level']] = { level: resp.data[i]['level'], branch_data: [resp.data[i]] }
          } else {
            module_data[resp.data[i]['level']]['branch_data'].push(resp.data[i])
          }
        }
        if (resp.data[i]['department'] == 'APPROVAL') {
          if (apprval_data[resp.data[i]['level']] == undefined) {
            apprval_data[resp.data[i]['level']] = { level: resp.data[i]['level'], branch_data: [resp.data[i]] }
          } else {
            apprval_data[resp.data[i]['level']]['branch_data'].push(resp.data[i])
          }
        }
        if (resp.data[i]['department'] == 'CRROS-MODULE') {
          if (cross_module_data[parseInt(resp.data[i]['level'])] == undefined) {
            cross_module_data[parseInt(resp.data[i]['level'])] = { module: parseInt(resp.data[i]['level']), module_show: true, level_data: [{ level: resp.data[i]['level'], branch_data: [resp.data[i]] }] }
          } else {
            console.log(cross_module_data)
            var tt = cross_module_data[parseInt(resp.data[i]['level'])];

            var flag=true;
            for (let k = 0; k < tt['level_data'].length; k++) {
              if (resp.data[i]['level'] == tt['level_data'][k]['level']) {
                tt['level_data'][k]['branch_data'].push(resp.data[i]);
                flag=false;
              }
            }
            if(flag){
              tt['level_data'].push({ level: resp.data[i]['level'], branch_data: [resp.data[i]] })
            }

            cross_module_data[parseInt(resp.data[i]['level'])] = tt;
          }
        }
      }
      console.log(cross_module_data);
      this.moduledata = Object.values(module_data);
      this.Apprmoduledata = Object.values(apprval_data);
      this.crossmoduledata1 = Object.values(cross_module_data);
      console.log(this.crossmoduledata1);


      $('.nav-tabs a[href="#tab-3"]').tab('show')

    } else {

    }
  }

  async Update() {

    var data = [];
    for (let i = 0; i < this.moduledata.length; i++) {
      var pp = this.moduledata[i]['branch_data']
      for (let j = 0; j < pp.length; j++) {
        pp[j]['department'] = 'MODULE';
        data.push(pp[j])
      }
    }

    for (let i = 0; i < this.crossmoduledata1.length; i++) {
      var level_data = this.crossmoduledata1[i]['level_data']
      for (let j = 0; j < level_data.length; j++) {
        var branch_data = level_data[j]['branch_data']
        for (let k = 0; k < branch_data.length; k++) {
          branch_data[k]['department'] = 'CRROS-MODULE';
          data.push(branch_data[k])
        }
      }
    }

    for (let i = 0; i < this.Apprmoduledata.length; i++) {
      var pp = this.Apprmoduledata[i]['branch_data']
      for (let j = 0; j < pp.length; j++) {
        pp[j]['department'] = 'APPROVAL';
        data.push(pp[j])
      }
    }


    for (let i = 0; i < data.length; i++) {
      if (data[i]['condition_exists']) {
        data[i]['condition_exists'] = 1
      } else {
        data[i]['condition_exists'] = 0
      }

      if (data[i]['sent_to_vendor']) {
        data[i]['sent_to_vendor'] = 1
      } else {
        data[i]['sent_to_vendor'] = 0
      }

      if (data[i]['all_user_approval_req']) {
        data[i]['all_user_approval_req'] = 1
      } else {
        data[i]['all_user_approval_req'] = 0
      }
    }

    console.log(data)
    this.spinner.show();
    this.FlowObj['b_acct_id'] = this.b_acct_id;
    this.FlowObj['data'] = data;
    this.FlowObj['module_cd'] = 'ACCOUNT';
    this.FlowObj['comment'] = 'ACCOUNT ka work Flow';
    this.FlowObj['update_user_id'] = this.erpUser.user_id;
    this.FlowObj['status'] = 'ACTIVE';
    console.log(this.FlowObj)
    var resp = await this.mainServiceMd.updateNewWorkflow(this.FlowObj);
    if (resp['error'] == false) {
      this.spinner.hide();
      await this.getAllActiveWorkFlow();

      this.toastr.successToastr('Updated Successfully ');
    }
    else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data']);
    }

  }


  viewData = []
  selectedApproval = {}
  async viewRule(element) {
    console.log(element);
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['status'] = 'ACTIVE';
    obj['doc_type'] = element['doc_type'];
    obj['module_cd'] = element['module_cd'];
    var resp = await this.mainServiceMd.getWorkflows(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp.data);
      this.viewData = resp.data;
      $('#workflow').modal('show');
    } else {
      this.viewData = [];
      Swal.fire('Error', resp.data, 'error');
    }
  }
}
