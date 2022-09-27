import { Injectable } from '@angular/core';
import { MainService } from '../../services/hrms/service/main.service';
import { PayrollService } from '../../services/hrms/service/payroll.service';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

declare var $: any
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class PrintSalBillService {

  constructor(private mainService:MainService,private payrollService:PayrollService) { }
  b_acct_id;

  monthObj = { '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December' }
  monthObjShort = { '1': 'JAN', '2': 'FEB', '3': 'MAR', '4': 'APR', '5': 'MAY', '6': 'JUN', '7': 'JUL', '8': 'AUG', '9': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC' }
  monthEnd = { '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30, '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31 }

  async printSalbill(req, erpUser){

    console.log(req);
    console.log(erpUser);
    this.b_acct_id=erpUser.b_acct_id;
    await this.getAllBill(req);
  }

  currentBillObj
  all_component = []
  async getAllBill(element) {
    this.currentBillObj = { header: {}, allEmployees: [], data: {}, sums: {} };

    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['bill_id'] = element['bill_id'];

    var resp1 = await this.payrollService.getAllComponent(JSON.stringify(obj));
    if (resp1['error'] == false) {
      this.all_component = resp1.data;
    } else {
      return;
    }

    let obb = new Object();
    obb['emp_id'] = '';
    obb['emp_name'] = '';
    obb['designation_code'] = '';
    obb['grade_pay_code'] = '';
    obb['pay_band'] = '';
    obb['sal_acc'] = '';
    obb['pf'] = '';
    obb['pf_ifsc'] = '';
   
    for (let i = 0; i < this.all_component.length; i++) {
      if (this.all_component[i]['pay_code'] == 'PAY') {
        obb[this.all_component[i]['component_code']] = 0
      }
    }

    obb['gross_pay'] = 0
    for (let i = 0; i < this.all_component.length; i++) {
      if (this.all_component[i]['pay_code'] == 'DED') {
        obb[this.all_component[i]['component_code']] = 0
      }
    }
    obb['total'] = 0
    obb['net'] = 0;
    console.log(obb)
    var resp = await this.payrollService.getAllBill(JSON.stringify(obj));
    if (resp['error'] == false) {
      var billObj = {};
      var header = "";
      var dt = resp['data'];
      console.log(dt)
      if (dt.length > 0) {
        header = dt[0];
      }
      var grand = undefined;
      var month = "";
      var fin_year = "";
      var fixedarr = [];

      for (var i = 0; i < dt.length; i++) {
        if (billObj[dt[i]['section_code']] == undefined) {
          month = dt[i]['month'];
          fin_year = dt[i]['fin_year'];
          billObj[dt[i]['section_code']] = {};
          billObj[dt[i]['section_code']]['data'] = {};//{'BASIC':0.00,'DA':0.00,'DEP':0.00,'HRA':0.00,'MA':0.00,'VA':0.00,'WA':0.00,'miscpay':[],'LIC1':0.00,LIC2:0.00,LIC3:0.00,LIC4:0.00,LIC5:0.00,LIC6:0.00,LIC7:0.00,PF:0.00,GIS:0.00,IT:0.00,HRR:0.00,VD:0.00,VADV:0.00,BLDADV1:0.00,BLDADV2:0.00,BLDADV3:0.00,PFADV:0.00,PFADV1:0.00,PFADV2:0.00,BADV:0.00,EWF:0.00,miscded:[]};
          billObj[dt[i]['section_code']]['total'] = { 'BASIC': 0.00, 'DA': 0.00, 'DEP': 0.00, 'HRA': 0.00, 'MA': 0.00, 'VA': 0.00, 'WA': 0.00, 'miscpay': [], 'LIC1': 0.00, LIC2: 0.00, LIC3: 0.00, LIC4: 0.00, LIC5: 0.00, LIC6: 0.00, LIC7: 0.00, PF: 0.00, NPS: 0.00, GIS: 0.00, IT: 0.00, HRR: 0.00, VD: 0.00, VADV: 0.00, BLDADV1: 0.00, BLDADV2: 0.00, BLDADV3: 0.00, PFADV: 0.00, PFADV1: 0.00, PFADV2: 0.00, BADV: 0.00, EWF: 0.00, miscded: [], total: 0.00, net: 0.00 };
          if (grand == undefined) {
            grand = { 'BASIC': 0.00, 'DA': 0.00, 'DEP': 0.00, 'HRA': 0.00, 'MA': 0.00, 'VA': 0.00, 'WA': 0.00, 'miscpay': [], 'LIC1': 0.00, LIC2: 0.00, LIC3: 0.00, LIC4: 0.00, LIC5: 0.00, LIC6: 0.00, LIC7: 0.00, PF: 0.00, NPS: 0.00, GIS: 0.00, IT: 0.00, HRR: 0.00, VD: 0.00, VADV: 0.00, BLDADV1: 0.00, BLDADV2: 0.00, BLDADV3: 0.00, PFADV: 0.00, PFADV1: 0.00, PFADV2: 0.00, BADV: 0.00, EWF: 0.00, miscded: [], total: 0.00, net: 0.00 };
          }
        }
        if (billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']] == undefined) {
          fixedarr = []
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']] = Object.assign({}, obb);
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['emp_id'] = (dt[i]['emp_id']);
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['emp_name'] = dt[i]['emp_name']
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['designation_code'] = ''
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['grade_pay_code'] = ''
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['pay_band'] = ''
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['sal_acc'] = ''
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['pf'] = ''
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['pf_ifsc'] = ''
        }

        if (dt[i]['pay_code'] == 'PAY') {
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['gross_pay'] += dt[i]['pay_component_amt'];
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['net'] += dt[i]['pay_component_amt'];
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']][dt[i]['pay_component_code']] += dt[i]['pay_component_amt']
         
        } else {
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['total'] += dt[i]['pay_component_amt'];
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']]['net'] -= dt[i]['pay_component_amt'];
          billObj[dt[i]['section_code']]['data'][dt[i]['emp_id']][dt[i]['pay_component_code']] += dt[i]['pay_component_amt']
        
        }


      }
     
        console.log(billObj, header, grand, month, fin_year)
        this.print(billObj, header, grand, month, fin_year);

     
      // this.spinner.hide()
    } else {
      // this.spinner.hide();
      // swal.fire("Error", "Error while printing pay bill", 'error')
    }
  }
  print(billObj, header, grand, month, fin_year) {
    var file_name = header['bill_desc'];
    console.log(billObj, header, grand)
    //var txt = "VARANASASI DEVELOPMENT AUTHORITY(VDA)   Officers/THIRD/FOURTH Category EMPLOYEES STATEMENT FOR THE MONTH OF June,2020   PIRNT DATE: 2020-10-10"
    var txt = this.mainService.accInfo['account_name'] + "(" + this.mainService.accInfo['account_short_name'] + ")" + "   " + header['bill_desc'] + "   Date: " + header['accrual_date'];
    var dd = {
      pageSize: 'A3',
      header: function (currentPage, pageCount) {
        var obj = { text: txt + "     Page No. - " + currentPage, alignment: 'center', margin: [72, 40] };
        return obj;
      },

      //footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },

      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [40, 60, 40, 60],
      //pageMargins: [ 40, 20, 20, 20 ],
      content: [

      ]
    };
    var sections = Object.keys(billObj);
    var count = 0;
    for (var i = 0; i < sections.length; i++) {
      var data = billObj[sections[i]];

      var sectionText = { text: 'Section : ' + sections[i], fontSize: 8 };
      if (i != 0) {
        sectionText['pageBreak'] = 'before'
      }
      let list = ['Emp\nDetail'];
      let data_keys = [];
      let width = ['auto'];
      for (let i = 0; i < this.all_component.length; i++) {
        if (this.all_component[i]['pay_code'] == 'PAY') {
          list.push(this.all_component[i]['component_code'])
          data_keys.push(this.all_component[i]['component_code'])
          width.push('auto')
        }
      }
      list.push('Total');
      data_keys.push('gross_pay');

      for (let i = 0; i < this.all_component.length; i++) {
        if (this.all_component[i]['pay_code'] == 'DED') {
          list.push(this.all_component[i]['component_code']);
          data_keys.push(this.all_component[i]['component_code'])

          width.push('auto')
        }
      }
      list.push('Total Ded');
      data_keys.push('total');
      width.push('auto');
      list.push('Net.\nSal.');
      width.push('auto');
      data_keys.push('net');

      console.log(width)

      var tbl = {
        fontSize: 10,
        table: {
          headerRows: 1,
          widths: [],
          body: [
            []
          ]
        }
      };
      for (let i = 0; i < list.length; i++) {
        tbl.table.body[0].push(list[i]);
        tbl.table.widths.push('auto')
      }
      dd.content.push(tbl);
      var emps = Object.keys(data['data']);
      count = count + emps.length;

      console.log(data['data'])
      console.log(emps);
      var total_obj = new Object();
      total_obj['emp_info'] = 'Total'
      for (var j = 0; j < emps.length; j++) {
        var obj = data['data'][emps[j]];
        var arr = [];
        var str = obj['emp_id'] + "\n" + obj['emp_name']
        arr.push(str);
        for (let x = 0; x < data_keys.length; x++) {
          if (total_obj[data_keys[x]] == undefined) {
            total_obj[data_keys[x]] = parseInt((obj[data_keys[x]]).toFixed(0))
          } else {
            total_obj[data_keys[x]] = total_obj[data_keys[x]] + parseInt((obj[data_keys[x]]).toFixed(0))
          }
          arr.push((obj[data_keys[x]]).toFixed(0))
        }
        

        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      dd.content[dd.content.length - 1].table.body.push(Object.values(total_obj));

     

    }
   
    dd.content.push("\n\n");
    var sign1 = {
      columns: [
        {
          width: '*',
          text: 'PREPARED BY:',
          bold: true
        },

        {
          width: '*',
          text: 'CHECKED BY:',
          bold: true
        },
        {
          width: '*',
          text: 'SIGNED BY:',
          bold: true
        }


      ],

    }
    dd.content.push("\n\n\n");
    dd.content.push(sign1);
    dd.content.push("\n\n");
    dd.content.push({ text: "CERTIFIED:", bold: true })
    dd.content.push("\n\n");
    dd.content.push({ text: "1. That I have satisfied myself that all the salaries included in the bills drawn in the month of " + this.monthObj[month] + "/" + fin_year + " [the last preceding month] with the exception of those detailed below of which total has been refunded by deduction from the bill has been distributed to the proper persons and their receipts have been taken in acquittance rolls field in my office with reciept-stamp dully cancelled for every payment in access of Rs. 20 and that all leaves and promotions etc have been in the service book of the official concerned." })
    dd.content.push("\n");
    dd.content.push({ text: "2. That all persons for whom pay has been drawn in this bill have actually been entertained during the month." })
    dd.content.push("\n");

    dd.content.push({ text: "3. That all the persons for whom house-rent allowance has been shown in this bill actually occupied a rented house for which they paid rent as shown in this bill and are entitled to the allowance under the standing instructions." })
    dd.content.push("\n");

    dd.content.push({ text: "4. That all the persons in respect of whom conveyance allowance has been drawn in the bill have satisfied me that they have actually maintained the conveyance in a workable condition and have been using them." })
    dd.content.push("\n");

    dd.content.push({ text: "5. That the bill has been checked with the sanctioned in the scale register." })
    dd.content.push("\n");

    dd.content.push({ text: "Date :                                                    Signature Of Drawing Officer:" })
    dd.content.push("\n");

    dd.content.push({ text: "Pay Rs. ....................................." })




    pdfMake.createPdf(dd).download(file_name);
  }

  
}
