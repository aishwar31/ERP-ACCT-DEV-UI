import { Component, OnInit, ViewChild } from '@angular/core';

import { MainService } from '../../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { OrgHierService } from '../../service/org-hier.service';
import Swal from 'sweetalert2';
import { MainService as mainServiceMD } from '../../../services/md/service/main.service';

declare var $: any;

 
@Component({
  selector: 'app-Accounts-data-auth',
  templateUrl: './Accounts-data-auth.component.html',
  styleUrls: ['./Accounts-data-auth.component.css']
})
export class AccountsDataAuthComponent implements OnInit {


  erpUser;
  b_acct_id;
  Obj = {}
  ActiveNode = [];

  allRoles = [];
  allComp;
  selectedComp = [];
  dataSource;
  role_name;
  role_id;

  displayedColumns: string[] = ['user_id', 'node_cd', 'status', 'Roles', 'node_path', 'node_desc', 'action'];
  constructor(private orgHierService: OrgHierService, private spinner: NgxSpinnerService, private mainServiceMD: mainServiceMD, public mainService: MainService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getAllRoles();
    await this.getAllCurrentUserList();
    await this.getAccountUserInfo()
    await this.getcostcenters();
    await this.getAllAccountdataAssigned();
    this.Obj['status'] = 'ACTIVE'
    await this.filter_list()
    await this.getorg()
    this.reset()
  }
  //orghier
  open_orgpopup() {
    // this.planing_arr = []
    //this.planing_arr = []
    if (this.planing_arr.length == 0) {
      this.down({}, -1)
    }

    $('#ORGHIER').modal('show');
  }
  setHierarchyNodeitem(item, i) {
    console.log(item, i);
    item['is_leaf'] = this.orghierobjisleaf[item['hierarchy_type']]

    console.log(this.orghierobjisleaf[item['hierarchy_type']]);

    let flag = false
    let dummy2 = []
    //console.log(this.planing_arr, this.existing_heirarchy_nodes, item, i)
    for (let i = 0; i < this.planing_arr.length; i++) {
      dummy2.push(this.orghierobj[this.planing_arr[i]['hierarchy_type']])
    }
    this.Obj['node_cd'] = this.planing_arr[this.planing_arr.length - 1]['hierarchy_type']
    /*  let dummy2 = []
     if (dummy.length > 0) {
       for (let i = 0; i < dummy.length; i++) {
         for (let j = 0; j < this.existing_heirarchy_nodes.length; j++) {
           if (dummy[i] == this.existing_heirarchy_nodes[j]['node_cd']) {
             flag = true
             item['level'] = this.existing_heirarchy_nodes[j]['level']
             dummy2.push(this.existing_heirarchy_nodes[j]['node_desc'])
           }
         }
       }
     }
     if (flag == false) {
       this.Obj['node_cd'] = null
     } */
    this.Obj['path_desc'] = dummy2.join(' --> ')
  }
  // planing_arr = []
  orghier = []
  orghierobj = {}
  orghierobjtype = {}
  orghierobjtypecd = {}
  orghierobjisleaf = {}
  orghierobjlevel = {}
  orghierobjpath = {}
  async getorg() {
    let obj = new Object()
    obj['b_acct_id'] = this.b_acct_id
    obj['org_hier_code'] = 'FIN'
    let resp = await this.orgHierService.getHierarchy(obj)
    console.log(resp);

    if (resp['error'] == false) {
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['lvl1_value'] == "Root Org") {
          resp.data[i]['lvl1_value'] = 'Org-root'

        }
      }
      // this.allcostcenters = []
      console.log(resp['data'])
      this.orghier = resp['data']
      for (let i = 0; i < resp['data'].length; i++) {
        let path = []
        for (let j = 1; j < 8; j++) {

          path.push(resp['data'][i]['lvl' + (j) + '_value'])
          this.orghierobj[resp['data'][i]['lvl' + (j) + '_cd']] = resp['data'][i]['lvl' + (j) + '_value']
          this.orghierobjtype[resp['data'][i]['lvl' + (j) + '_cd']] = resp['data'][i]['lvl' + (j) + '_node_type']
          this.orghierobjtypecd[resp['data'][i]['lvl' + (j) + '_cd']] = resp['data'][i]['lvl' + (j) + '_cd']
          this.orghierobjisleaf[resp['data'][i]['lvl' + (j) + '_cd']] = resp['data'][i]['is_leaf']
          this.orghierobjlevel[resp['data'][i]['lvl' + (j) + '_cd']] = j
          this.orghierobjpath[resp['data'][i]['lvl' + (j) + '_cd']] = path.join("-->")

        }
        /*  if(resp['data'][i]['cc_func']=="ACCOUNT")
         {
           let obb = Object.assign({},resp['data'][i])
           obb['node_cd'] = obb['cc_code']
           obb['desc'] = obb['cc_code'] +'-'+obb['cc_name']
           obb['node_desc'] = obb['desc']
           this.allcostcenters.push(obb)
           
         } */

      }
      // this.allcostcenters = [...resp['data']]
      //console.log(this.allcostcenters)
      // this.planing_arr[1] = {existing_heirarchy_nodes:[...this.allcostcenters]} 
      console.log(this.planing_arr);



    } else {
      this.spinner.hide()
      Swal.fire('Error...', 'Error While Getting Cost Center', 'error')
    }
  }
  submit_act() {
    if (this.planing_arr[this.planing_arr.length - 1]['is_leaf'] == 0) {
      Swal.fire('Error', 'You Have Not Selected Leaf At The Last Level', 'error')

    } else {
      $('#ORGHIER').modal('hide');
    }
  }
  down(item, k) {
    console.log(this.planing_arr)
    let patharr = []
    for (let i = 0; i < this.planing_arr.length; i++) {
      console.log(this.planing_arr[i])

      patharr.push(this.orghierobj[this.planing_arr[i]['hierarchy_type']])


    }
    this.Obj['path_desc'] = patharr.join("-->")
    this.planing_arr.push({ level: k + 2, existing_heirarchy_nodes: [] })
    let arr = []
    for (let i = 0; i < this.orghier.length; i++) {
      if (!arr.includes(this.orghier[i]['lvl' + (k + 2) + '_cd']) && this.orghier[i]['lvl' + (k + 2) + '_cd'] != null) {
        if (this.orghier[i]['lvl' + (k + 1) + '_cd'] == item['hierarchy_type'] || k == -1) {
          this.planing_arr[k + 1]['existing_heirarchy_nodes'].push({ node_cd: this.orghier[i]['lvl' + (k + 2) + '_cd'], desc: this.orghier[i]['lvl' + (k + 2) + '_value'], is_leaf: this.orghier[i]['is_leaf'] })
          arr.push(this.orghier[i]['lvl' + (k + 2) + '_cd'])

        }

      }
      /*   if(this.orghier[i]['lvl'+(k+1)+'_user_cd'] == item['node_cd']){
  
        } */

    }
  }
  remove(item, i) {
    if (this.planing_arr.length > 1) {
      this.planing_arr.pop()
      let patharr = []
      for (let i = 0; i < this.planing_arr.length; i++) {
        console.log(this.planing_arr[i])

        patharr.push(this.orghierobj[this.planing_arr[i]['hierarchy_type']])


      }
      this.Obj['path_desc'] = patharr.join("-->")
    }

  }
  // ***********************************Account Integration******************************************************************
  allcostcenters = []
  async getcostcenters() {
    let obj = new Object()
    obj['b_acct_id'] = this.b_acct_id
    obj['module_cd'] = 'ACCOUNT'
    let resp = await this.orgHierService.getCost(obj)
    // let resp = this.orghierobjlevel['data']
    if (resp['error'] == false) {
      this.allcostcenters = []
      console.log(resp['data'])
      for (let i = 0; i < resp['data'].length; i++) {
        if (resp['data'][i]['cc_func'] == "ACCOUNT") {
          let obb = Object.assign({}, resp['data'][i])
          obb['node_cd'] = obb['cc_code']
          obb['desc'] = obb['cc_code'] + '-' + obb['cc_name']
          obb['node_desc'] = obb['desc']
          this.allcostcenters.push(obb)

        }

      }
      // this.allcostcenters = [...resp['data']]
      console.log(this.allcostcenters)
      // this.planing_arr[1] = {existing_heirarchy_nodes:[...this.allcostcenters]} 
      console.log(this.planing_arr);



    } else {
      this.spinner.hide()
      Swal.fire('Error...', 'Error While Getting Cost Center', 'error')
    }
  }
  // ***********************************Account Integration******************************************************************
  assigned_data = []
  async getAllAccountdataAssigned() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    console.log(obj)
    let resp = await this.orgHierService.getAllAccountdataAssigned(JSON.stringify(obj));
    // let resp = this.orghierobjlevel['data']
    console.log(resp, 'all data')
    this.assigned_data = resp['data']
    if (resp['error'] == false) {
    }
  }
  allaccountsdata = [];
  nodecdtopath = {};
  nodecdtoleve = {}
  nodecdtodesc = {}

  async filter_list() {
    let dummy = []
    for (let i = 0; i < this.assigned_data.length; i++) {
      if (this.Obj['status'] == this.assigned_data[i]['status']) {
        this.assigned_data[i]['path'] = this.orghierobjpath[this.assigned_data[i]['node_cd']]
        this.assigned_data[i]['level'] = this.orghierobjlevel[this.assigned_data[i]['node_cd']]
        this.assigned_data[i]['node_desc'] = this.orghierobj[this.assigned_data[i]['node_cd']]
        dummy.push(this.assigned_data[i])
      }
    }
    for (let i = 0; i < dummy.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (dummy[i]['user_id'] == this.users[j]['user_id']) {
          dummy[i]['user_name'] = this.users[j]['emp_name']
          let id = dummy[i]['user_id'];
          if (this.role_herarichy[id] != undefined)
            dummy[i]['roles'] = this.role_herarichy[id]['role_name']

        }
      }
    }

    console.log(dummy);

    this.allaccountsdata = dummy
    this.dataSource = new MatTableDataSource()
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  access = []

  userObj = {};
  // async getAccountUserInfo() {
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   console.log(obj)
  //   var resp = await this.mainServiceMD.getuserforrolemapping(JSON.stringify(obj));
  //   console.log(resp)
  //   if (resp['error'] == false) {
  //     for (let i = 0; i < resp.data.length; i++) {
  //       this.userObj[resp.data[i]['user_id']] = resp.data[i]['user_id'] + " - " + resp.data[i]['emp_name']+ " - " + resp.data[i]['emp_phone_no']
  //     }
  //   }

  //   console.log(this.userObj)
  // }


  // userObj={};
  users = []
  async getAccountUserInfo() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['module_cd'] = "ACCOUNT";
    console.log(obj)
    var resp = await this.mainServiceMD.getuserforrolemapping(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.users = resp.data;
      console.log(this.users);
      for (let i = 0; i < this.users.length; i++) {
        this.userObj[this.users[i]['user_id']] = this.users[i]['emp_name']
        this.users[i]['desc'] = this.users[i]['user_id'] + " - " + this.users[i]['emp_name'] + " - " + this.users[i]['emp_phone_no']
      }
    }
    console.log(this.userObj, 'userObj')
  }
  status = [{ id: 'ACTIVE' }, { id: 'INACTIVE' }]
  lastselct = [];
  setHierarchyNode(item, i) {
    console.log(this.planing_arr)
    let flag = false
    let dummy = []
    //console.log(this.planing_arr, this.existing_heirarchy_nodes, item, i)
    for (let i = 0; i < this.planing_arr.length; i++) {
      dummy.push(this.planing_arr[i]['hierarchy_type'])
    }
    let dummy2 = []
    if (dummy.length > 0) {
      for (let i = 0; i < dummy.length; i++) {
        for (let j = 0; j < this.existing_heirarchy_nodes.length; j++) {
          if (dummy[i] == this.existing_heirarchy_nodes[j]['node_cd']) {
            flag = true
            item['level'] = this.existing_heirarchy_nodes[j]['level']
            this.Obj['node_cd'] = this.existing_heirarchy_nodes[j]['node_cd']
            dummy2.push(this.existing_heirarchy_nodes[j]['node_desc'])
          }
        }
      }
    }
    if (flag == false) {
      this.Obj['node_cd'] = null
    }
    this.Obj['path_desc'] = dummy2.join(' --> ')
    this.lastselct = dummy
    console.log(this.lastselct);

  }
  used_nodes = []
  selected_row = {}
  add_dropdown(data, index) {

    //console.log(data, index)
    let flag = true
    let obj = {}
    for (let i = 0; i < this.existing_heirarchy_nodes.length; i++) {
      if (data['hierarchy_type'] == this.existing_heirarchy_nodes[i]['node_cd']) {
        obj = Object.assign({}, this.existing_heirarchy_nodes[i])
      }
    }
    this.selected_row = Object.assign({}, obj)
    this.selected_row['index'] = index

    this.filter_data()
  }
  filter_data() {
    console.log(this.planing_arr);

    let dummy = []
    let max_level = 0
    for (let i = 0; i < this.existing_heirarchy_nodes.length; i++) {
      // if (this.Obj['hier_ident_code'] == this.planaing_hierarchy[i]['hier_ident_code']) {
      //   max_level = this.planaing_hierarchy[i]['level_count']
      //   break;
      // }
      if (this.existing_heirarchy_nodes[i]['level'] >= max_level) {
        max_level = this.existing_heirarchy_nodes[i]['level']
      }

    }

    for (let i = 0; i < this.allcostcenters.length; i++) {
      if (!this.existing_heirarchy_nodes.includes(this.allcostcenters[i]))
        this.existing_heirarchy_nodes.push(this.allcostcenters[i])
    }
    console.log(max_level, this.selected_row, this.existing_heirarchy_nodes)
    for (let j = 1; j <= max_level; j++) {
      for (let i = 0; i < this.existing_heirarchy_nodes.length; i++) {
        let node_arr = []
        node_arr = this.existing_heirarchy_nodes[i]['path'].split('|')
        // console.log(node_arr, 'noida arr', this.existing_heirarchy_nodes[i], node_arr.includes(this.selected_row['node_cd']), this.selected_row)
        if (node_arr.includes(this.selected_row['node_cd'])) {
          if (this.existing_heirarchy_nodes[i]['level'] == j && this.existing_heirarchy_nodes[i]['level'] > this.selected_row['level']) {
            dummy.push(this.existing_heirarchy_nodes[i])
          }
        }
      }
      if (dummy.length > 0) {
        break;
      }
    }
    this.planing_arr.push({})
    this.planing_arr[this.selected_row['index'] + 1]['existing_heirarchy_nodes'] = []
    this.planing_arr[this.selected_row['index'] + 1]['existing_heirarchy_nodes'] = dummy
    console.log(dummy, 'dummy', this.planing_arr)
  }
  allAccountsRole = []
  roles = []
  roleObj = {}
  async getAllRoles() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['module_cd'] = 'ACCOUNT';
    var resp = await this.mainServiceMD.getCurrentMdRole(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.roles = []
      this.allAccountsRole = resp.data;
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['is_system_role'] == 0) {
          this.roles.push(resp.data[i])
        }
        this.roleObj[resp.data[i]['role_cd']] = resp.data[i]['role_name'];
      }

    }
  }
  allUsers = []
  role_herarichy = {}
  async getAllCurrentUserList() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['module_cd'] = 'ACCOUNT';
    var resp = await this.mainServiceMD.getCurrentMdUser(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      this.allUsers = resp['data']
      var emp_id = new Object();
      for (let i = 0; i < resp['data'].length; i++) {
        for (let j = 0; j < this.allAccountsRole.length; j++) {
          if (this.allAccountsRole[j]['role_cd'] == resp['data'][i]['role_cd']) {
            if (emp_id[resp['data'][i]['user_id']] == undefined) {
              resp['data'][i]['role_name'] = this.allAccountsRole[j]['role_name']
              emp_id[resp['data'][i]['user_id']] = resp['data'][i]
            } else {
              emp_id[resp['data'][i]['user_id']]['role_name'] = emp_id[resp['data'][i]['user_id']]['role_name'] + " , " + this.allAccountsRole[j]['role_name']
            }
          }
        }
      }
      console.log(emp_id)
      this.role_herarichy = emp_id;


    }
  }
  serchfilter = ""
  find() {

    let l = this.planing_arr.length

    console.log(this.allaccountsdata);
    let newdata = []
    let len = this.allaccountsdata.length

    for (let x = 0; x < len; x++) {

      for (let j = 0; j < this.planing_arr.length; j++) {
        if (this.allaccountsdata[x]['node_cd'] == this.planing_arr[j]['hierarchy_type']) {
          newdata.push(this.allaccountsdata[x]);

        }

      }



    }
    console.log(newdata);

    this.dataSource = new MatTableDataSource(newdata)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;






  }
  remove_dropdown(data, i) {
    //console.log(data, i)
    if (this.planing_arr.length > 1) {
      this.planing_arr.pop()
    }
    let dummy = []
    for (let i = 0; i < this.planing_arr.length; i++) {
      dummy.push(this.planing_arr[i]['hierarchy_type'])
    }
    let dummy2 = []
    if (dummy.length > 0) {
      for (let i = 0; i < dummy.length; i++) {
        for (let j = 0; j < this.existing_heirarchy_nodes.length; j++) {
          if (dummy[i] == this.existing_heirarchy_nodes[j]['node_cd']) {
            this.Obj['node_cd'] = this.existing_heirarchy_nodes[j]['node_cd']
            dummy2.push(this.existing_heirarchy_nodes[j]['node_desc'])
          }
        }
      }
    }
    this.Obj['path_desc'] = dummy2.join(' --> ')
  }
  planing_arr = [{}]
  NodeCodeToNodeDesc = {};
  existing_heirarchy_nodes = []

  async getAllHeirNodeList() {
    this.spinner.show();
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    console.log(obj)
    var resp = await this.orgHierService.getHierarchy(JSON.stringify(obj));
    // let resp = this.orghierobjlevel['data']
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide()
      console.log(resp['data']);
      this.ActiveNode = [];
      this.existing_heirarchy_nodes = resp['data']
      for (let i = 0; i < this.existing_heirarchy_nodes.length; i++) {
        let node_arr = []
        this.nodecdtoleve[this.existing_heirarchy_nodes[i]['node_cd']] = this.existing_heirarchy_nodes[i]['level']
        this.nodecdtodesc[this.existing_heirarchy_nodes[i]['node_cd']] = this.existing_heirarchy_nodes[i]['node_desc']
        node_arr = this.existing_heirarchy_nodes[i]['path'].split('|')
        this.nodecdtopath[this.existing_heirarchy_nodes[i]['node_cd']] = node_arr.join(' --> ')

      }

      for (let i = 0; i < this.allcostcenters.length; i++) {
        this.allcostcenters[i]['level'] = 2;
        this.allcostcenters[i]['is_leaf'] = 0;
        this.allcostcenters[i]['node_type'] = 'CC';
        this.allcostcenters[i]['path'] = 'ACCOUNT|' + this.allcostcenters[i]['node_cd'];


        this.NodeCodeToNodeDesc[this.allcostcenters[i]['node_cd']] = this.allcostcenters[i];
      }

      console.log(this.nodecdtoleve);
      console.log(this.nodecdtopath);
      this.NodeCodeToNodeDesc = {};
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['status'] == 'ACTIVE') {
          if (!resp['data'][i]['node_type']) {
            resp['data'][i]['desc'] = resp['data'][i]['node_desc'];
          } else {
            resp['data'][i]['desc'] = resp['data'][i]['node_desc'] + ' - (' + this.mainService.codeValueShowObj['ACCOUNT003'][resp['data'][i]['node_type']] + ')';
          }
          this.ActiveNode.push(resp.data[i])
        }
        this.NodeCodeToNodeDesc[resp['data'][i]['node_cd']] = resp['data'][i]['node_desc']
      }
      let dummy = []
      for (let i = 0; i < this.existing_heirarchy_nodes.length; i++) {
        if (1 == this.existing_heirarchy_nodes[i]['level']) {
          dummy.push(this.existing_heirarchy_nodes[i])
        }
      }
      this.planing_arr[0]['existing_heirarchy_nodes'] = dummy
      console.log(this.ActiveNode);

      // this.dataSource = new MatTableDataSource(resp['data'])
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    } else {
      this.spinner.hide()
      Swal.fire('Error...', 'Error While ACCOUNT HIER', 'error')
    }
  }




  async inactive(element) {

    this.spinner.show();
    var obj = Object.assign({}, element)
    obj['b_acct_id'] = this.b_acct_id
    obj['update_user_id'] = this.erpUser.user_id;
    obj['status'] = 'INACTIVE';
    console.log(obj)
    var resp = await this.orgHierService.updateAccountdataAssign(obj);
    // let resp = this.orghierobjlevel['data']
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide();
      await this.getAllAccountdataAssigned();
      this.filter_list()
      Swal.fire("Success...", "Status Successfully Changed To Inactive", 'success');

    }
    else {
      this.spinner.hide();
      Swal.fire('Error...', 'Error While Changing Status...', 'error');
    }

  }
  async reset() {
    this.Obj = {}
    //// this.planing_arr = []
    // this.planing_arr = [{}]
    this.planing_arr = []
    //this.planing_arr = []
    this.down({}, -1)
    this.getorg()
    this.Obj['status'] = 'ACTIVE'
    await this.filter_list()
  }
  async submit() {
    this.Obj['node_cd'] = this.planing_arr[this.planing_arr.length - 1]['hierarchy_type']
    if (this.Obj['node_cd'] && this.Obj['user_id']) {
      // this.spinner.show()
      this.Obj['b_acct_id'] = this.b_acct_id
      this.Obj['create_user_id'] = this.erpUser.user_id;
      this.Obj['status'] = 'ACTIVE';
      console.log(this.Obj)
      var resp = await this.orgHierService.insertAccountdataAssign(this.Obj);
      // let resp = this.orghierobjlevel['data']
      if (resp['error'] == false) {
        this.spinner.hide();
        await this.getAllAccountdataAssigned();
        Swal.fire("Success..", "Successfully Created", 'success');
      }
      else {
        this.spinner.hide();
        Swal.fire('Error...', 'Error While Assign Node..', 'error');
      }
    } else {
      Swal.fire('Warning...', 'Please Enter All Fields Marked As *', 'warning')
    }
  }

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
