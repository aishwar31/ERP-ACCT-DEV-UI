import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '../../authentication.service';
import { BillService } from '../service/bill.service';
import { EbillPrintService } from '../../portal/service/ebill-print.service'
import { EventGroupService } from '../service/event-group.service'
import { EventsService } from '../service/events.service';
import { JournalService } from '../service/journal.service';
import { LedgerService } from '../service/ledger.service';
import { MainService } from '../../portal/service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { PrintSalBillService } from '../../portal/service/print-sal-bill.service'
import { RuleProcessService } from '../service/rule-process.service';
import { RuleProcessingNewService } from '../service/rule-processing-new.service';
import { RuleService } from '../service/rule.service';
import swal from 'sweetalert2';

declare var $: any;

 
 
@Component({
  selector: 'app-department-bill',
  templateUrl: './department-bill.component.html',
  styleUrls: ['./department-bill.component.css']
})

// @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
// @ViewChild(MatSort, { static: true }) sort: MatSort;
export class DepartmentBillComponent {
  dataSource: any[];
  allEventLayouts
  fieldTechnicalNames = {}
  fieldBusinessNames = {}
  selectLayoutFields = []
  fieldTechNameTOBusinessName = {}
  allFields = []
  allRule = []
  fin_year
  constructor(private printSalBillService:PrintSalBillService,private ebillPrintService: EbillPrintService, private billService: BillService, public mainService: MainService, private ledgerService: LedgerService, private ruleProcessService: RuleProcessService, private ruleProcessingNewService: RuleProcessingNewService, private ruleService: RuleService, private journalService: JournalService, private snackBar: MatSnackBar, private spinner: NgxSpinnerService, private EventsService: EventsService, public auth: AuthenticationService, public eventGroupService: EventGroupService) { }
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('sortCol2', { static: true }) sortCol2: MatSort;

  displayedColumns = ['id', 'local_doc_no', 'module_doc_type', 'desc', 'doc_type', 'amt', 'Action'];
  displayedColumns1 = [];

  datasource;
  datasource1
  ListObj = {}
  erpUser
  b_acct_id
  moduleArr = []
  statusArr = [
    { value: "APPROVED" },
    { value: "PROCESSED" },
    { value: "REJECTED" }
  ];

  systemDate
  orgShortName
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    var resp = await this.billService.getSystemDate();
    this.systemDate = resp.data
    this.orgShortName = await this.mainService.accInfo['account_short_name']
    console.log(this.orgShortName)
    await this.getallFields();
    await this.getAllEventLayouts();
    await this.eventChange()
    await this.getAccountModule()
    await this.getAllRuleList();
    await this.getActiveFinYear();

  }
  async getActiveFinYear() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.ledgerService.getActiveFinYear(JSON.stringify(obj));
    if (resp['error'] == false) {
      if (resp.data.length == 0) {
        swal.fire("Warning", "..Active Financial Year Not set!", 'warning');
      } else {
        this.fin_year = resp.data[0].fin_year;
      }
    } else {
      swal.fire("Error", "..Error while getting active  fin year!", 'error');
    }
  }

  async getAllRuleList() {
    var resp = await this.ruleService.getAllRules(this.b_acct_id);
    if (resp['error'] == false) {
      this.allRule = resp.data;
      this.spinner.hide();
    } else {
      this.spinner.show()
      this.snackBar.open("Error while getting  all rule list", 'Error', {
        duration: 5000
      });
    }
  }
  async getallFields() {
    var obj = new Object();
    obj['domain_code'] = 'ACCOUNT';
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.journalService.getFields(obj);
    this.allFields = [];
    if (resp['error'] == false) {
      this.allFields = resp.data;
      this.fieldTechNameTOBusinessName = {};

      for (let i = 0; i < this.allFields.length; i++) {
        this.fieldTechnicalNames[this.allFields[i]['field_code']] = this.allFields[i]['field_technical_name']
        this.fieldBusinessNames[this.allFields[i]['field_code']] = this.allFields[i]['field_business_name'];
        this.fieldTechNameTOBusinessName[this.allFields[i]['field_technical_name']] = this.allFields[i]['field_business_name']

      }
    } else {
      this.snackBar.open("Error while getting Fields", "Error", {
        duration: 5000,
      });
    }
  }

  async getAllEventLayouts() {
    this.spinner.show()
    var resp = await this.EventsService.getEventLayoutss(this.b_acct_id);
    if (resp['error'] == false) {
      this.allEventLayouts = resp.data;
      this.spinner.hide()
    } else {
      this.spinner.show()
      this.snackBar.open("Error while getting Event Records", 'Error', {
        duration: 5000
      });
    }
  }


  eventChange() {
    let selectedLayout = ''
    this.selectLayoutFields = []

    // for (let i = 0; i < this.allEvents.length; i++) {

    //   if (this.allEvents[i]['event_code'] == this.obj['event_code']) {
    //     
    //   }
    // }
    for (let j = 0; j < this.allEventLayouts.length; j++) {
      if ("R101" == this.allEventLayouts[j]['record_code']) {
        selectedLayout = this.allEventLayouts[j]
      }
    }
    let fieldsCodes = selectedLayout['field_code'].split(",")

    for (let i = 0; i < fieldsCodes.length; i++) {
      let ob = new Object
      ob['code'] = this.fieldTechnicalNames[fieldsCodes[i]]
      //ob['value'] = fieldsCodes[i] + " - " + this.fieldBusinessNames[fieldsCodes[i]] + " - " + this.fieldTechnicalNames[fieldsCodes[i]]
      ob['value'] = this.fieldBusinessNames[fieldsCodes[i]]
      this.displayedColumns1.push(this.fieldTechnicalNames[fieldsCodes[i]])

      this.selectLayoutFields.push(ob)
    }
    console.log(this.selectLayoutFields)
  }
  async getAccountModule() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    console.log(obj)
    var resp = await this.auth.getaccountmodule(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.moduleArr = []
      let arr = resp['data'][0]['module_cd'].split(",");
      for (let i = 0; i < arr.length; i++) {
       // if (arr[i] != 'ACCOUNT' && arr[i] != 'AA' && arr[i] != 'ENG') {
          let ob = Object.assign({}, {})
          ob['module_cd'] = arr[i]
          this.moduleArr.push(ob)

       // }
      }
    } else {

    }
  }
  async submit() {

    if (this.ListObj['module_cd'] == undefined || this.ListObj['status'] == undefined) {

      return;
    }
    if (this.ListObj['module_cd'] == null || this.ListObj['status'] == null) {
      return
    }
    var obj = Object.assign({}, this.ListObj);
    obj['b_acct_id'] = this.b_acct_id
    obj['is_rec_or_pay'] = 'PAYABLE'
    console.log(obj)
    this.spinner.show()
    // var resp = await this.eventGroupService.geteventlist(JSON.stringify(obj));

    if(this.ListObj['module_cd'] == 'ACCOUNT'){
      var resp = await this.billService.getAllContingentBills(this.b_acct_id);
    }else{
      var resp = await this.eventGroupService.geteventlist(JSON.stringify(obj));
    }

    console.log('value', resp);
    if (resp['error'] == false) {
      let data = []
      for (let i = 0; i < resp.data.length; i++) {
        if (resp['data'][i]['status'] == this.ListObj['status']) {
          data.push(resp['data'][i])
        }
      }
      this.datasource = new MatTableDataSource(data);
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;
      this.spinner.hide()
    }
    if (resp['error'] == true) {
      console.log('ERROR')
      this.spinner.show()
      swal.fire("Error", "...", 'error');


    }
  }

  /*   applyFilter(event: Event) {
  
      const filterValue = (event.target as HTMLInputElement).value;
      this.datasource.filter = filterValue.trim().toLowerCase();
  
      if (this.datasource.paginator) {
        this.datasource.paginator.firstPage();
      }
    } */


  applyFilter(filterValue: string) {

    this.datasource.filter = filterValue.trim().toLowerCase();
    /* if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    } */
  }

  applyFilter2(filterValue: string) {

    this.datasource1.filter = filterValue.trim().toLowerCase();
    /*  if (this.datasource.paginator1) {
       this.datasource.paginator1.firstPage();
     } */
  }

  async view(element) {
    var obj = Object.assign({}, {});
    obj['b_acct_id'] = this.b_acct_id
    obj['event_group_id'] = [element['id']]
    console.log(element);
    
    var resp = await this.eventGroupService.geteventxref(JSON.stringify(obj));
    console.log('value', resp);


    let eventdata = []
    // console.log(resp.data.length);
    // console.log(resp.data);
    eventdata=resp['data'];

    // console.log(eventdata)
    this.datasource1 = new MatTableDataSource(eventdata);
    this.datasource1.sort = this.sortCol2;
    this.datasource1.paginator = this.paginator1;
    $('#A').modal('show');


  }
  async process(element) {
    var obj = Object.assign({}, {});
    console.log(element);

    obj['b_acct_id'] = this.b_acct_id
    obj['event_group_id'] = [element['id']]
    var resp = await this.eventGroupService.geteventxref(JSON.stringify(obj));
    console.log('value', resp);


    let eventdata = []
    // for (let i = 0; i < resp.data.length; i++) {
    //   let tt = Object.assign({}, JSON.parse(resp['data'][i]['data']))
    //   tt['local_doc_desc'] = element["local_doc_no"] + " - " + element['local_doc_desc']
    //   eventdata.push(tt)

    // }
    eventdata=resp['data'];
    console.log(eventdata)
    var processed_data = await this.ruleProcessingNewService.startProcessing(eventdata);
    console.log(processed_data)
    if(processed_data['error']==true){
      swal.fire("Error", processed_data['data'], 'error');
      return;

    }
    if (processed_data['data'].length > 0) {


      var obj1 = Object.assign({}, element);
      obj1['b_acct_id'] = this.b_acct_id;
      obj1['status'] = 'PROCESSED';
      obj1['update_user_id'] = this.erpUser.user_id;
      obj1['jrnl'] = processed_data['data'];
      console.log(obj1);
      
      var resp = await this.eventGroupService.insertProcessedData(obj1);
      if (resp['error'] == false) {
        this.spinner.hide();
        await this.submit();
        swal.fire("Success", "Processed Successfully!", 'success');
      } else {
        this.spinner.show();
        swal.fire("Error", "...Error while Processed  Bill Insert!", 'error');
      }
    } else {
      console.log(processed_data)
      this.spinner.show();
      swal.fire("Error", "...Some Events does not have rule  !", 'error');
    }
  }
  async download(element) {

    if (element['module_doc_type'] == 'EBILL') {
      let req = JSON.parse(element['req_data'])
      await this.ebillPrintService.printEbill(req, this.erpUser)
    }
    if (element['module_doc_type'] == 'SAL_BILL') {
      let req = JSON.parse(element['req_data'])
      await this.printSalBillService.printSalbill(req, this.erpUser)
    }
  }
  /*  applyFilter2(event: Event){
     const filterValue = (event.target as HTMLInputElement).value;
     this.datasource.filter = filterValue.trim().toLowerCase();
 
     if (this.datasource.paginator) {
       this.datasource.paginator.firstPage();
     }
   } */
  refresh() {

  }
}