import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartOfAccountService } from '../../service/chart-of-account.service';
import { JvService } from '../../service/jv.service'
import { LedgerService } from '../../service/ledger.service'
import { MainService } from '../../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { SettingService } from '../../service/setting.service'
import Swal from 'sweetalert2';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

 
 
@Component({
  selector: 'app-jv',
  templateUrl: './jv.component.html',
  styleUrls: ['./jv.component.css']
})
export class JvComponent implements OnInit {
  datasource: MatTableDataSource<unknown>;

  constructor(private snackBar: MatSnackBar, private ledgerService: LedgerService, public mainS: MainService, private ch_acc_S: ChartOfAccountService, private spinner: NgxSpinnerService, private jvService: JvService) { }
  erpUser;
  obj = {}
  q = 1;
  dataSource1;
  status: any = [{ id: 'UNPOSTED' }, { id: 'APPROVED' }, { id: 'REJECTED' }, { id: 'PROCESSED' }]
  b_acct_id;
  acount_name
  systemDate;
  displayedColumns = ['ld_jrnl_ref_num', 'db_amount', 'cr_amount', 'ld_jrnl_entry_cd', 'prep_id', 'create_timestamp', 'status', 'action']
  displayedcolumns1 = ['ld_jrnl_ref_num', 'db_amount', 'cr_amount', 'ld_jrnl_entry_cd', 'prep_id', 'create_timestamp', 'action']
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sortCol1') sortCol1: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild("sortCol2") sortCol2: MatSort;
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    var resp = await this.mainS.getSystemDate();
    this.systemDate = resp.data
    await this.getFinYear()
    await this.allChartOfAccount()
    await this.getAllUnPostedJournalInfo();
    this.acount_name = this.mainS.accInfo['account_name']
  }

  fin_year = []
  async getFinYear() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.ledgerService.getAllFinYear(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.spinner.hide()
      this.fin_year = resp['data']
    } else {
      this.spinner.hide()
    }
  }
  chartOfAcc = []
  async allChartOfAccount() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.ch_acc_S.getchartofaccount(obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.chartOfAcc = resp['data']
    } else {
      this.spinner.hide()
    }
  }
  async post(element) {
    this.spinner.show()
    let new_obj = new Object()
    new_obj['b_acct_id'] = this.b_acct_id
    new_obj['jrnl_id'] = element['jrnl_id']
    new_obj['ld_jrnl_lfcycl_st_cd'] = 'POSTED'

    var resp = await this.jvService.UpdateStatus(new_obj)
 
    if (resp['error'] == false) {

    
      await this.getAllUnPostedJournalInfo()
      
    } else {
      this.spinner.hide()
    }
  
    
  }

postedJournals=[]
unpostedJournals=[]
  async getAllUnPostedJournalInfo() {
    var obj = Object.assign({}, this.obj);
    obj['b_acct_id'] = this.b_acct_id;
 
  
    var resp = await this.ledgerService.getJournalList(JSON.stringify(obj));
   
    if (resp['error'] == false) {
      this.postedJournals=[]
      this.unpostedJournals=[]
      for(let i=0;i<resp['data'].length;i++){
        if(resp['data'][i]['ld_jrnl_lfcycl_st_cd']=='POSTED'){
          this.postedJournals.push(resp['data'][i])
        }else{
          this.unpostedJournals.push(resp['data'][i])
        }
      }
          this.datasource = new MatTableDataSource(this.unpostedJournals)
          this.datasource.paginator = this.paginator1;
          this.datasource.sort = this.sortCol1;
          this.dataSource1 = new MatTableDataSource(this.postedJournals);
          this.dataSource1.sort = this.sortCol2;
          this.dataSource1.paginator = this.paginator2;
          this.spinner.hide();
          await this.refresh();
    
    } else {
      this.spinner.hide()
      this.snackBar.open("Error while getting  all Unposted Journal info list", 'Error', {
        duration: 5000
      });
    }

  }

 


  applyFilter(filterValue: string) {

    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }
  applyFilter1(filterValue: string) {

    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  async reject(element) {
    this.spinner.show()
    let obj = new Object();
    obj['b_acct_id'] = this.b_acct_id
    obj['ld_jrnl_lfcycl_st_cd'] = 'REJECTED'
    obj['jrnl_id'] = element['jrnl_id']

    var resp = await this.jvService.UpdateStatus(obj)
    if (resp['error'] == false) {
      // await this.postedJV()
      this.spinner.hide()
      Swal.fire('This Record Successfully Rejected', '', 'success')
    }
    else {
      this.spinner.hide()
      Swal.fire('Some Error Occured While Rejecting', '', 'error')

    }
  }
  async delete(element) {
    let new_obj = new Object()
    new_obj['b_acct_id'] = this.b_acct_id
    new_obj['jrnl_id'] = element['jrnl_id']
    var resp = await this.jvService.deleteJV(JSON.stringify(new_obj))
    if (resp['error'] == false) {
      await this.getAllUnPostedJournalInfo()
      this.spinner.hide()
      Swal.fire('Journal deleted Successfully', '', 'success')
    }
    else {
      this.spinner.hide()
      Swal.fire('Error Occured', '', 'error')
    }
  }

  async approveJV(element) {
    this.spinner.show()
    let new_obj = new Object()
    new_obj['b_acct_id'] = this.b_acct_id
    new_obj['jrnl_id'] = element['jrnl_id']
    new_obj['ld_jrnl_lfcycl_st_cd'] = 'APPROVED'



    var resp = await this.jvService.UpdateStatus(new_obj)
 
    if (resp['error'] == false) {

      // for (let i = 0; i < resp['data'].length; i++) {
      //   let ob = new Object()
      //   if (resp['data'][i]['acct_dt']) {
      //     ob['acct_dt'] = resp['data'][i]['acct_dt'].split('T')[0]
      //   }
      //   ob['ld_jrnl_lfcycl_st_cd']=resp['data'][i]['ld_jrnl_lfcycl_st_cd']
      //   ob['arr_id'] = resp['data'][i]['arr_id']
      //   ob['chart_of_account'] = resp['data'][i]['chart_of_account']
      //   ob['create_timestamp'] = resp['data'][i]['create_timestamp']
      //   ob['db_cd_ind'] = resp['data'][i]['db_cd_ind']
      //   ob['event_code'] = resp['data'][i]['event_code']
      //   ob['event_id'] = resp['data'][i]['event_id']
      //   ob['event_ln_id'] = resp['data'][i]['event_ln_id']
      //   ob['fin_year'] = resp['data'][i]['fin_year']
      //   ob['jrnl_desc'] = resp['data'][i]['jrnl_desc']
      //   ob['appr_id'] = resp['data'][i]['appr_id']
      //   ob['jrnl_desc'] = resp['data'][i]['jrnl_desc']
      //   ob['jrnl_dtl_ln_id'] = resp['data'][i]['jrnl_dtl_ln_id']
      //   ob['jrnl_id'] = resp['data'][i]['jrnl_id']
      //   ob['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
      //   ob['jrnl_ln_id'] = resp['data'][i]['jrnl_ln_id']
      //   ob['jrnl_type'] = resp['data'][i]['jrnl_type']
      //   ob['ledger_type'] = resp['data'][i]['ledger_type']
      //   ob['org_unit_cd'] = resp['data'][i]['org_unit_cd']
      //   ob['prep_id'] = resp['data'][i]['prep_id']
      //   if (resp['data'][i]['proc_dt']) {
      //     ob['proc_dt'] = resp['data'][i]['proc_dt'].split('T')[0]
      //   }
      //   ob['tgt_curr_cd'] = resp['data'][i]['tgt_curr_cd']
      //   ob['txn_amt'] = resp['data'][i]['txn_amt']
      //   console.log('ob',ob)
      //   console.log('id',resp['data'][i]['id'])
      //   new_obj['jrnl'].push(ob)
      //   new_obj['id'].push(resp['data'][i]['id'])
      //   console.log('new_obj',new_obj)
      // }
      await this.getAllUnPostedJournalInfo()
      
    } else {
      this.spinner.hide()
    }
  
  
  }
  async schedule(element) {
    this.spinner.show()
    let obj = new Object();
    obj['b_acct_id'] = this.b_acct_id
    obj['status'] = 'UNDER APPROVAL'
    obj['jrnl_id'] = element['jrnl_id']
    var resp = await this.jvService.UpdateStatus(obj)
    if (resp['error'] == false) {
      await this.getAllUnPostedJournalInfo()
      this.spinner.hide()
      Swal.fire('This Record Successfully Scheduled', '', 'success')
    }
    else {
      this.spinner.hide()
      Swal.fire('Some Error Occured While Scheduling', '', 'error')
    }
  }

  table_header = [{ key: 'chart_acct', value: 'Account Head', width: 20 }, { key: 'jrnl_line_desc', value: 'Perticulars', width: 10 }, { key: 'db', value: 'Debit(DB)', width: 10 }, { key: 'cr', value: 'Credit(CR)', width: 10 }];
  emb_desc;
  emb_no;
  emb_date
  work_order_no
  project_cd
  print_data = []
  view_header = {}
  new_data = []
  async view(element) {
    this.new_data = []
    this.view_header = Object.assign({}, element)
    let acct_date = '';
    this.print_data = []
    this.spinner.show()
    let new_obj = new Object()
    new_obj['b_acct_id'] = this.b_acct_id
    new_obj['jrnl_id'] = element['jrnl_id']
    let status = ''
    if (this.obj['status'] == 'UNPOSTED') {
      status = 'Un-Posted'
    } else if (this.obj['status'] == 'POSTED') {
      status = 'Posted'
    } else if (this.obj['status'] == 'UNDER APPROVAL') {
      status = 'Under Posted'
    } else if (this.obj['status'] == 'REJECTED') {
      status = 'Rejected'
    }
    else if (this.obj['status'] == 'APPROVED') {
      status = 'Approved'
    }

    this.view_header['status'] = status
    var resp = await this.jvService.get_Jrnl_Id_Full_Info(JSON.stringify(new_obj))
    if (resp['error'] == false) {
      this.spinner.hide()
    } else {
      this.spinner.hide()
    }

    for (let i = 0; i < resp['data'].length; i++) {
      for (let j = 0; j < this.chartOfAcc.length; j++) {
        if (resp['data'][i]['chart_of_account'] == this.chartOfAcc[j]['leaf_code']) {
          resp['data'][i]['chart_acct'] = this.chartOfAcc[j]['leaf_value'] + ' (' + this.chartOfAcc[j]['leaf_code'] + ')'
          if (!acct_date) {
            acct_date = resp['data'][i]['acct_dt'].split('T')[0]
          }
          if (resp['data'][i]['jrnl_line_desc']) {
            resp['data'][i]['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
          } else {
            resp['data'][i]['jrnl_line_desc'] = ''
          }
        }
      }
    }
    this.view_header['ref_dt'] = acct_date
    for (let i = 0; i < resp['data'].length; i++) {
      let obj3 = {}

      if (resp['data'][i]['db_cd_ind'] == 'DB') {
        obj3['db'] = -1*resp['data'][i]['txn_amt']
        obj3['cr'] = 0
        obj3['chart_acct'] = resp['data'][i]['chart_acct']
        obj3['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
      }
      else if (resp['data'][i]['db_cd_ind'] == 'CR') {
        obj3['cr'] = resp['data'][i]['txn_amt']
        obj3['db'] = 0
        obj3['chart_acct'] = resp['data'][i]['chart_acct']
        obj3['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
      }
      this.print_data.push(obj3)
    }
    let ar = [];

    for (let i = 0; i < this.print_data.length; i++) {
      let db = 0
      let cr = 0
      let obj = {};


      for (let j = 0; j < this.print_data.length; j++) {

        if (this.print_data[i]['chart_acct'] == this.print_data[j]['chart_acct'] && this.print_data[i]['jrnl_line_desc'] == this.print_data[j]['jrnl_line_desc']) {
          db = this.print_data[j]['db'] + db
          cr = this.print_data[j]['cr'] + cr
          obj['db'] = db
          obj['cr'] = cr
          obj['chart_acct'] = this.print_data[i]['chart_acct']
          obj['jrnl_line_desc'] = this.print_data[i]['jrnl_line_desc']
        }
      }
      if (!ar.includes(this.print_data[i]['chart_acct'] + this.print_data[i]['jrnl_line_desc'])) {
        this.new_data.push(obj);
      }
      ar.push(this.print_data[i]['chart_acct'] + this.print_data[i]['jrnl_line_desc'])


    }
    let db2 = 0;
    let cr2 = 0;
    for (let i = 0; i < this.new_data.length; i++) {
      db2 = db2 + this.new_data[i]['db']
      cr2 = cr2 + this.new_data[i]['cr']
    }
    let no = {}
    no['db'] = db2
    no['cr'] = cr2
    no['chart_acct'] = ''
    no['jrnl_line_desc'] = 'Final Amount'
    this.new_data.push(no)
    $('#exampleModal').modal('show');
  }

  async refresh(){
    let new_obj = new Object()
    new_obj={}

  }

  async show(element) {
    this.new_data = []
    this.view_header = Object.assign({}, element)
    let acct_date = '';
    this.print_data = []
    this.spinner.show()
    let new_obj = new Object()
    new_obj['b_acct_id'] = this.b_acct_id
    new_obj['jrnl_id'] = element['jrnl_id']
    let status = ''
    if (this.obj['status'] == 'UNPOSTED') {
      status = 'Un-Posted'
    } else if (this.obj['status'] == 'POSTED') {
      status = 'Posted'
    } else if (this.obj['status'] == 'UNDER APPROVAL') {
      status = 'Under Posted'
    } else if (this.obj['status'] == 'REJECTED') {
      status = 'Rejected'
    }
    else if (this.obj['status'] == 'APPROVED') {
      status = 'Approved'
    }

    this.view_header['status'] = status
    var resp = await this.jvService.get_Jrnl_Id_Full_Info(JSON.stringify(new_obj))
    if (resp['error'] == false) {
      this.spinner.hide()
    } else {
      this.spinner.hide()
    }

    for (let i = 0; i < resp['data'].length; i++) {
      for (let j = 0; j < this.chartOfAcc.length; j++) {
        if (resp['data'][i]['chart_of_account'] == this.chartOfAcc[j]['leaf_code']) {
          resp['data'][i]['chart_acct'] = this.chartOfAcc[j]['leaf_value'] + ' (' + this.chartOfAcc[j]['leaf_code'] + ')'
          if (!acct_date) {
            acct_date = resp['data'][i]['acct_dt'].split('T')[0]
          }
          if (resp['data'][i]['jrnl_line_desc']) {
            resp['data'][i]['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
          } else {
            resp['data'][i]['jrnl_line_desc'] = ''
          }
        }
      }
    }
    this.view_header['ref_dt'] = acct_date
    for (let i = 0; i < resp['data'].length; i++) {
      let obj3 = {}

      if (resp['data'][i]['db_cd_ind'] == 'DB') {
        obj3['db'] = resp['data'][i]['txn_amt']
        obj3['cr'] = 0
        obj3['chart_acct'] = resp['data'][i]['chart_acct']
        obj3['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
      }
      else if (resp['data'][i]['db_cd_ind'] == 'CR') {
        obj3['cr'] = resp['data'][i]['txn_amt']
        obj3['db'] = 0
        obj3['chart_acct'] = resp['data'][i]['chart_acct']
        obj3['jrnl_line_desc'] = resp['data'][i]['jrnl_line_desc']
      }
      this.print_data.push(obj3)
    }
    // let ar = []
    // for (let i = 0; i < this.print_data.length; i++) {
    //   let db = 0
    //   let cr = 0
    //   let obj = {}
    //   ar.push(this.print_data[i]['chart_acct'])
    //   for (let j = 0; j < this.print_data.length; j++) {
    //     if (this.print_data[i]['chart_acct'] == this.print_data[j]['chart_acct'] && this.print_data[i]['cr'] == this.print_data[j]['cr'] && this.print_data[i]['db'] == this.print_data[j]['db'] && this.print_data[i]['jrnl_line_desc'] == this.print_data[j]['jrnl_line_desc'] && !ar.includes(this.print_data[i]['chart_acct'])) {
    //       obj['db'] = this.print_data[j]['db'] + db
    //       obj['cr'] = this.print_data[j]['cr'] + cr
    //       obj['chart_acct'] = this.print_data[i]['chart_acct']
    //       obj['jrnl_line_desc'] = this.print_data[i]['jrnl_line_desc']
    //     } else {
    //       obj['db'] = this.print_data[i]['db']
    //       obj['cr'] = this.print_data[i]['cr']
    //       obj['chart_acct'] = this.print_data[i]['chart_acct']
    //       obj['jrnl_line_desc'] = this.print_data[i]['jrnl_line_desc']
    //     }
    //   }
    //   this.new_data.push(obj)
    // }


    let ar = [];
    for (let i = 0; i < this.print_data.length; i++) {
      let db = 0
      let cr = 0
      let obj = {};
      for (let j = 0; j < this.print_data.length; j++) {

        if (this.print_data[i]['chart_acct'] == this.print_data[j]['chart_acct'] && this.print_data[i]['jrnl_line_desc'] == this.print_data[j]['jrnl_line_desc']) {
          db = this.print_data[j]['db'] + db
          cr = this.print_data[j]['cr'] + cr
          obj['db'] = db
          obj['cr'] = cr
          obj['chart_acct'] = this.print_data[i]['chart_acct']
          obj['jrnl_line_desc'] = this.print_data[i]['jrnl_line_desc']
        }
      }
      if (!ar.includes(this.print_data[i]['chart_acct'] + this.print_data[i]['jrnl_line_desc'])) {
        this.new_data.push(obj);
      }
      ar.push(this.print_data[i]['chart_acct'] + this.print_data[i]['jrnl_line_desc'])
    }

    let db2 = 0;
    let cr2 = 0
    for (let i = 0; i < this.new_data.length; i++) {
      db2 = db2 + this.new_data[i]['db']
      cr2 = cr2 + this.new_data[i]['cr']
    }
    let no = {}
    no['db'] = db2
    no['cr'] = cr2
    no['chart_acct'] = ''
    no['jrnl_line_desc'] = 'Final Amount'
    this.new_data.push(no)
    // ------------
    var txt = this.mainS.accInfo['account_name'] + '(' + this.mainS.accInfo['account_short_name'] + ')'
    var dd = {
      pageSize: 'A4',
      header: function (currentPage, pageCount) {
        var obj = { text: txt + "     Page No. - " + currentPage, alignment: 'center', margin: [72, 40] };
        return obj;
      },

      pageOrientation: 'portrait',

      pageMargins: [40, 60, 40, 60],
      content: [
      ]
    };
    var header0 = {
      columns: [
        {
          width: '*',
          text: 'JOURNAL VOUCHER',
          bold: true,
          alignment: 'center'
        }
      ],

    }

    var header1 = {
      columns: [
        {
          width: '*',
          text: 'Ref Voucher :',
          bold: true
        },

        {
          width: '*',
          text: 'JV -' + element['jrnl_id']
        },
        {
          width: '*',
          text: 'Ref. Voucher :',
          bold: true
        },

        {
          width: '*',
          text: acct_date
        },
        {
          width: '*',
          text: 'Print Date :',
          bold: true
        },

        {
          width: '*',
          text: this.mainS.dateFormatChange(this.systemDate)
        }
      ],
    }
    var header2 = {
      columns: [
        {
          width: '*',
          text: 'Particular :',
          bold: true

        },
        {
          width: '*',
          text: element['jrnl_desc'],


        },
        {
          width: '*',
          text: '',
          bold: true
        },

        {
          width: '*',
          text: ''
        }
      ],
    }
    var header3 = {
      columns: [

        {
          width: '*',
          text: 'JV Status :',
          bold: true
        },

        {
          width: '*',
          text: status
        },
        {
          width: '*',
          text: '',
          bold: true
        },

        {
          width: '*',
          text: ''
        }
      ],
    }
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.05 }] });
    dd.content.push({ text: " " });
    dd.content.push(header0);
    dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.05 }] });
    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push({ text: " " });
    dd.content.push(header2);
    dd.content.push({ text: " " });
    dd.content.push(header3);
    dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.05 }] });
    var tbl = {

      layout: 'lightHorizontalLines',
      fontSize: 10,
      table: {

        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        body: [
          ['Chart Of Account', 'Perticulars', 'Debit', 'Credit']
        ]
      }
    };
    dd.content.push(tbl);
    for (var i = 0; i < this.new_data.length; i++) {
      var arr = []
      arr.push(this.new_data[i]['chart_acct']);
      arr.push(this.new_data[i]['jrnl_line_desc']);
      arr.push({ text: this.new_data[i]['db'], alignment: 'right' });
      arr.push({ text: this.new_data[i]['cr'], alignment: 'right' });
      dd.content[dd.content.length - 1].table.body.push(arr);
    }
    pdfMake.createPdf(dd).download("jv");
  }
}
