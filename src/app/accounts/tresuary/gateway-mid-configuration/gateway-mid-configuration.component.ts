import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { GatewayMidConfigService } from '../../service/gateway-mid-config.service';
import { MainService } from '../../../services/admin/service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

//import { GatewayMidConfigService } from '../../service/gateway-mid-config.service';

 
 
@Component({
  selector: 'app-gateway-mid-configuration',
  templateUrl: './gateway-mid-configuration.component.html',
  styleUrls: ['./gateway-mid-configuration.component.css']
})
export class GatewayMIDConfigurationComponent implements OnInit {
  erpUser: any;
  b_acct_id: any;
  gatewaydata: any;
  admindata: any;
  updateObj: any;
  constructor(private GatewayMidConfig: GatewayMidConfigService, private spinner: NgxSpinnerService, private adminMainService: MainService) { }
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  displayedColumns: string[] = ['gateway_id', 'gateway_desc', 'bank', 'account', 'mid_key', 'status', 'action'];
  Obj = {}
  dataSource: any;
  list_flag = true
  create_flag = false
  update_flag = false

  open_create() {

    this.list_flag = false
    this.create_flag = true
    this.update_flag = false

  }
  async open_list() {
    this.list_flag = true
    this.create_flag = false
    this.update_flag = false
    await this.getConfigureData()
  }

  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getGatwayList()
    await this.getConfigureData()
  }
  async getGatwayList() {
    var obj = new Object();
    obj['b_acct_id'] = 0
    var resp = await this.adminMainService.getPaymentGatwayData(JSON.stringify(obj));
    console.log(resp, 'gatway list')
    if (resp['error'] == false) {
      this.admindata = resp['data'];
    }
    else {
      Swal.fire("Error", "server side Error", 'error');
    }
  }
  async getConfigureData() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    this.spinner.show()
    var resp = await this.GatewayMidConfig.getGatewayConfigureData(JSON.stringify(obj));
    if (resp['error'] == false) {
      let dummy = resp['data']
      this.spinner.hide()
      this.dataSource = new MatTableDataSource(dummy)
      this.dataSource.sort = this.sort.toArray()[0];
      this.dataSource.paginator = this.paginator.toArray()[0];
      console.log(resp)
    }
    else {
      this.spinner.hide()
      Swal.fire("Error", "server side Error", 'error');
    }
  }
  open_update(element) {
    this.updateObj = Object.assign({}, element);
    console.log(this.updateObj)
    this.Obj = this.updateObj

    this.list_flag = false
    this.create_flag = false
    this.update_flag = true


  }



  async submit() {
    if (this.Obj['account_no'] && this.Obj['branch_name'] && this.Obj['bank_name'] && this.Obj['gateway_id']) {
      var obj = Object.assign({}, this.Obj)
      obj['status'] = 'Created'
      obj['b_acct_id'] = this.b_acct_id;
      console.log(obj)
      this.spinner.show()
      var resp = await this.GatewayMidConfig.createGatewayConfigure(obj);
      console.log(resp)
      if (resp['error'] == false) {
        this.spinner.hide()
        Swal.fire("Success", resp.data, 'success')
      }
      else {
        this.spinner.hide()
        Swal.fire("Error", "server side Error", 'error');
      }
    }
    else {
      Swal.fire("Error", "Please fill * Mandatory field", 'error');
    }

  }

  async update() {
    if (this.updateObj['mid_key'] && this.updateObj['aes_key'] && this.updateObj['account_no'] && this.updateObj['branch_name'] && this.updateObj['bank_name'] && this.updateObj['gateway_id']) {
      // console.log(this.Obj);
      this.updateObj['b_acct_id'] = this.b_acct_id;
      this.updateObj['life_cycle_status'] = 'ACTIVE'
      console.log(this.updateObj)
      this.spinner.show()
      var resp = await this.GatewayMidConfig.updateGatewayConfigure(this.updateObj);
      console.log(resp)
      if (resp['error'] == false) {
        this.spinner.hide()
        Swal.fire("Success", resp.data, 'success')
        // console.log(resp)
      }
      else {
        this.spinner.hide()
        Swal.fire("Error", resp['data'], 'error');
      }
    }
    else {
      Swal.fire("Error", "Please fill * Mandatory field", 'error');
    }
  }
  async Del(delobj) {
    let obj = Object.assign({}, delobj);
    obj['b_acct_id'] = this.b_acct_id;
    console.log(obj, 'delete')

    var resp = await this.GatewayMidConfig.inactiveGatewayConfigure(obj);
    if (resp['error'] == false) {
      Swal.fire("Success", resp.data, 'success')
      await this.open_list()
    }
    else {
      Swal.fire("Error", resp['data'], 'error');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

