import { ApproveService } from '../service/approve.service';
import { CommonDataService } from './common-data.service'
import { EbillService } from '../service/ebill.service';
import { Injectable } from '@angular/core';
import { MainService } from '../service/main.service';
import { MasterDataService } from '../service/master-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { TenderService } from '../service/tender.service'
import { UserService } from '../service/user.service';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;






@Injectable({
  providedIn: 'root'
})

export class EbillRunningBillPrintService {
  partyObj: Object;
  dedTypeArr = [];
  dedObj = {}
  alreadypaid = {};
  allDed = [];
  boqObj = {};
  boqItems = [];
  overunderobj = {};
  runningBill = []
  prevbillpartrate = {}
  prevbillquantity = {}
  workObj = {}



  constructor(
    private userService: UserService,
    public mainService: MainService,
    private CommonDataService: CommonDataService,
    private approveService: ApproveService,
    private ebillService: EbillService,
    private tenderService: TenderService,
    private masterDataService: MasterDataService,
    private spinner: NgxSpinnerService
  ) { }
  
  async print_cb(element,selectedTender) {
    var ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    var b_acct_id = ebillUser.b_acct_id;
    var id = element['id']
    var bill_no = element['bill_no']
    await this.getAllWorkInfo(b_acct_id)
    await this.getDeductions(b_acct_id, element.id);
    var obb = new Object();
    obb['b_acct_id'] = b_acct_id
    obb['work_id'] = selectedTender['work_id']
    await this.getAllparty(b_acct_id)
    var resp = await this.ebillService.getWorkBudInfo(JSON.stringify(obb))
    var bud = resp['data'][0]
    var account_name=ebillUser['account_name'];
    var account_short_name=ebillUser['account_short_name'];
    var txt = account_name + "(" +account_short_name+ ") \n";
    var partyObj = this.partyObj[selectedTender['party_id']];
   // var txt = "LUCKNOW DEVELOPMENT ATUHORITY" + "(" + "LDA" + ") , LUCKNOW "
    var txt1 = ''//"VIPIN KHAND,GOMTI NAGAR , LUCKNOW - 226010";
    var txt2 = '' //this.name.toString() + '(' + this.role_cd.toString() + ')  ';
    var dd = {
      pageSize: 'A3',
      footer: function (currentPage, pageCount) {
        var arr1 = []
        var obb1 = { text: txt2 + currentPage.toString() + ' of ' + pageCount, alignment: 'center', margin: [72, 40], bold: true, style: 'header' }
        arr1.push(obb1)
        return arr1
      },
      header: function (currentPage, pageCount) {
        var arr = []
        var obj = { text: txt, alignment: 'center', margin: [72, 40], fontSize: 15, bold: true, style: 'header' };
        arr.push(obj);

        return arr;
      },
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      content: [

      ]
    };
    var obj1 = { text: txt1, alignment: 'center', bold: true, style: 'header' };
    dd.content.push(obj1);

    var header1 = {
      columns: [
        {
          width: '*',
          text: 'CB FOR RUNNING BILL FOR FILE/EMB NO - ' + selectedTender['already_emb'],
          bold: true,
          alignment: 'center'
        }

      ],

    }
    var header2 = {
      columns: [
        {
          width: '*',
          text: 'C.B. No. :',
          bold: true

        },
        {
          width: '*',
          text: element['acc_id']
        },
        {
          width: '*',
          text: 'PRINT DATE :',
          bold: true
        },
        {
          width: '*',
          text: this.mainService.dateformatchange(element['bill_dt'])
        }
      ],

    }
    var header3 = {
      columns: [
        {
          width: '*',
          text: 'Current Bill :',
          bold: true

        },
        {
          width: '*',
          text: element.bill_no + " For Work ID.:" + selectedTender['work_id']
        },
        {
          width: '*',
          text: 'Contractor :',
          bold: true

        },
        {
          width: '*',
          text: partyObj,
          //bold: true

        }

      ],

    }

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });


    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push({ text: " " });


    dd.content.push(header2);

    dd.content.push(header3);

    dd.content.push({ text: " " });

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });

    var header8 = {
      columns: [
        {
          width: '*',
          text: 'Bill Description',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'Description of Charge/Number/Date of Authority for all charges requiring special',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'Amount',
          bold: true,
          alignment: 'right'
        }

      ],


    }
    dd.content.push({ text: " " });
    dd.content.push(header8);

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });
    var header9 = {
      columns: [
        {
          width: '*',
          text: element.bill_desc,
          bold: false,
          alignment: 'center'
        },
        {
          width: '*',
          text: selectedTender['work_id'] + " - " + this.workObj[selectedTender['work_id']]['work_order_name'],
          bold: false,
          alignment: 'center'
        },
        {
          width: '*',
          text: element['bill_amt'].toFixed(0),
          bold: false,
          alignment: 'right'
        }

      ],


    }
    var cgstHeader = {
      columns: [
        {
          width: '*',
          text: "",
          bold: false,
          alignment: 'center'
        },
        {
          width: '*',
          text: "CGST",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: element['cgst'].toFixed(0),
          bold: false,
          alignment: 'right'
        }

      ],


    }
    var sgstHeader = {
      columns: [
        {
          width: '*',
          text: "",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: "SGST",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: element['sgst'].toFixed(0),

          bold: false,
          alignment: 'right'
        }

      ],


    }
    var igstHeader = {
      columns: [
        {
          width: '*',
          text: "",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: "IGST",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: element['igst'].toFixed(0),

          bold: false,
          alignment: 'right'
        }

      ],


    }
    var addwithheld = {
      columns: [
        {
          width: '*',
          text: "",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: "Add With Held",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: element['add_with_held'].toFixed(0),

          bold: false,
          alignment: 'right'
        }

      ],


    }
    var addsecurity = {
      columns: [
        {
          width: '*',
          text: "",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: "Add Security",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: element['add_security'].toFixed(0),

          bold: false,
          alignment: 'right'
        }

      ],


    }
    if( element['labuor_cess'] == null ||  element['labuor_cess'] == undefined)  element['labuor_cess'] = 0
    let labour_cess = {
      columns: [
        {
          width: '*',
          text: "",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: "Add @ "+selectedTender['labour_cess']+" % Labour Cess",
          bold: false,
          alignment: 'left'
        },
        {
          width: '*',
          text: element['labuor_cess'].toFixed(0),

          bold: false,
          alignment: 'right'
        }

      ],


    }
    dd.content.push({ text: " " });

    dd.content.push(header9);
    dd.content.push({ text: " " });
    dd.content.push(cgstHeader);
    dd.content.push({ text: " " });
    dd.content.push(sgstHeader);
    dd.content.push({ text: " " });
    dd.content.push(igstHeader);
    dd.content.push({ text: " " });
    dd.content.push(addwithheld);
    dd.content.push({ text: " " });
    dd.content.push(addsecurity);
    dd.content.push({ text: " " });
    if(selectedTender['labour_cess_flag'] == 1) dd.content.push(labour_cess);
    if(selectedTender['labour_cess_flag'] == 1)  dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });
    dd.content.push({ text: " " });
    var totalPayable = Number((Number(element['bill_amt'].toFixed(0)) + Number(element['cgst'].toFixed(0)) + Number(element['sgst'].toFixed(0))
      + Number(element['igst'].toFixed(0)) + Number(element['add_with_held'].toFixed(0)) + Number(element['add_security'].toFixed(0))).toFixed(0));
    dd.content.push({ text: "Total Payable : " + (totalPayable + Number(element['labuor_cess'].toFixed(0))).toFixed(0), bold: true, alignment: 'right' });

    dd.content.push({ text: " " });

    dd.content.push({ text: "Deductions : ", bold: true });
    dd.content.push({ text: " " });

    var tbl = {

      fontSize: 10,
      table: {

        headerRows: 1,
        widths: ['*', '*', '*'],

        body: [
          [{ text: 'SR NO.', alignment: 'left', bold: true },
          { text: 'Dedution Name', alignment: 'left', bold: true },
          { text: 'Amount', alignment: 'right', bold: true }]
        ]
      }
    };
    var detdata = this.allDed
    var ttl = 0;
    this.dedObj[-1] = {}
    this.dedObj[-1]['ded_name'] = 'LABOUR CESS'
    for (var i = 0; i < detdata.length; i++) {
      var arr = [];
      arr.push({ text: i + 1 });
      if (detdata[i]['type'] == 'FIXED') {
        arr.push({ text: this.dedObj[detdata[i]['deduction_id']]['ded_name'] + "(FIXED)", alignment: 'left' });

      } else {
        arr.push({ text: this.dedObj[detdata[i]['deduction_id']]['ded_name'] + "@" + detdata[i]['rate'], alignment: 'left' });

      }
      arr.push({ text: detdata[i]['amt'].toFixed(0), alignment: 'right' });
      ttl = ttl + Number(detdata[i]['amt'].toFixed(0))
      tbl.table.body.push(arr)
    }
    dd.content.push(tbl)
    dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });
    dd.content.push({ text: " " });



    dd.content.push({ text: "Total Deductions : " + ttl.toFixed(0), bold: true, alignment: 'right' });
    dd.content.push({ text: " " });
    dd.content.push({ text: "With Held Amount : " + element.withheldamount.toFixed(0), bold: true, alignment: 'right' });
    dd.content.push({ text: " " });
    var netPayable = 0;
    var netPayable = Number(element.bill_amt.toFixed(0)) + Number(element.cgst) + Number(element.sgst) + Number(element['igst']) + Number(element.add_with_held) + Number(element.add_security) - Number(element.withheldamount) - Number(ttl.toFixed(0));
    dd.content.push({ text: "Net Payable : " + (netPayable +  Number(element['labuor_cess'].toFixed(0))).toFixed(0), bold: true, alignment: 'right' });
    dd.content.push({ text: " " });


    var header81 = {
      columns: [
        {
          width: '*',
          text: 'Budget Head :',
          bold: true,
          alignment: 'right'
        },
        {
          width: '*',
          text: bud['bud_cd'],
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Total :',
          bold: true,
          alignment: 'right'
        },
        {
          width: '*',
          text: bud['bud_amt'].toFixed(2),
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Balance :',
          bold: true,
          alignment: 'right'
        },
        {
          width: '*',
          text: (bud['bud_amt'] - bud['expense_amount']).toFixed(2),
          bold: true,
          alignment: 'left'
        }, {}, {}, {}, {}

      ],


    }
    dd.content.push({ text: " " });
    dd.content.push(header81);
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    var header11 = {
      columns: [
        {
          width: '*',
          text: "P.W.C.",
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'D.A.',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'E.E.',
          bold: true,
          alignment: 'center'
        }


      ],


    }
    var header10 = {
      columns: [
        {
          width: '*',
          text: "Accounts Clerck",
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'Actt.',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'AAO/AO/C.A.',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'F.C.',
          bold: true,
          alignment: 'center'
        }

      ],


    }
    var amt_word = this.toWords(totalPayable.toFixed(2));


    dd.content.push(header11);
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: "Passed for Payment of Rs." + totalPayable.toFixed(2) + " (" + amt_word + " only)", fontSize: 15 });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });

    dd.content.push(header10);
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });

    dd.content.push({ text: "Above payment of Rs." + totalPayable.toFixed(2) + " (" + amt_word + " only) sanctioned.", fontSize: 15 });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    var header12 = {
      columns: [
        {
          width: '*',
          text: "Jt. Secy /Add. Secy / Secretary",
          bold: true,
          alignment: 'right'
        }
      ],
    }
    dd.content.push(header12);

    pdfMake.createPdf(dd).download('bill' + '.pdf');


  }
  toWords(s) {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];

    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == '1') {
          str += tn[Number(n[i + 1])] + ' ';
          i++;
          sk = 1;
        } else if (n[i] != 0) {
          str += tw[n[i] - 2] + ' ';
          sk = 1;
        }
      } else if (n[i] != 0) {
        str += dg[n[i]] + ' ';
        if ((x - i) % 3 == 0) str += 'hundred ';
        sk = 1;
      }
      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + ' ';
        sk = 0;
      }
    }
    if (x != s.length) {
      var y = s.length;
      str += 'point ';
      for (let i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
  }
  zoneusers = []
  rolebyid = {}
  async prcessebilltoaccount(element, selectedTenderInfo, project_cd){
    var ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    var b_acct_id = ebillUser.b_acct_id;
    var id = element['id']
    var bill_no = element['bill_no']


    console.log(element, selectedTenderInfo);


    //get All Work  Data********************
    await this.getAllWorkInfo(b_acct_id);

    //get All Party  Data********************
    await this.getAllparty(b_acct_id);

    //get All BOQ Item Data********************
    await this.getBoqItems(b_acct_id, selectedTenderInfo['tender_id']);

    //await this.getApproveByDocLocalNumber(b_acct_id, element['id'], selectedTenderInfo['work_id'], project_cd);



    ///Map Data On Running Bill Object******
    for (var i = 0; i < this.boqItems.length; i++) {
      this.runningBill[i] = Object.assign(this.boqItems[i])
      this.runningBill[i]['billRate'] = 0;
      this.runningBill[i]['billCurrent'] = 0;
      this.runningBill[i]['billPrev'] = 0;
    }


    //get All Previous Bill Data********************
    var obj = new Object();
    obj['doc_local_no'] = element.id;
    obj['b_acct_id'] = b_acct_id;
    obj['doc_type'] = 'EBILL';
    await this.getPreviousBillItems(id, b_acct_id, bill_no, selectedTenderInfo['tender_id']);

    return this.runningBill



  }
  async getzoneusers(work_id, project_cd) {
    var Obj = Object()
    var ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    var b_acct_id = ebillUser.b_acct_id;
    Obj['b_acct_id'] = b_acct_id
    Obj['module_cd'] = 'EMB'
    Obj['status'] = 'ACTIVE'
    Obj['node_cd'] = work_id
    var resp = await this.mainService.getUsersForModuleWorkflow(JSON.stringify(Obj))
    if (resp['error'] == false) {
      this.spinner.hide();
      this.zoneusers = resp['data']
    } else {
      this.spinner.hide();
    }
  }
  statusArr = []

  async getApproveByDocLocalNumber(b_acct_id, doc_local_no, work_id, project_cd) {
    var obj = new Object();
    obj['doc_local_no'] = doc_local_no;
    obj['b_acct_id'] = b_acct_id;
    obj['doc_type'] = 'EBILL';
    obj['module_cd'] = 'EMB';
    //obj['module_cd'] = 'EMB';
    var resp = await this.mainService.getWorkflowlog(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      await this.getzoneusers(work_id, project_cd)
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['user_id'] == -1) {
          resp.data[i]['name'] = this.partyObj[resp['data'][i]['vendor_id']]
          resp.data[i]['role_cd'] = "Contractor"
          resp.data[i]['user_id'] = resp['data'][i]['vendor_id'];
          resp.data[i]['is_vendor'] = true
          continue;
        }
        for (let j = 0; j < this.zoneusers.length; j++) {
          if (resp.data[i]['user_id'] == this.zoneusers[j]['user_id'] && resp.data[i]['role_cd'] == this.zoneusers[j]['role_cd']) {
            resp.data[i]['name'] = this.zoneusers[j]['emp_name']
            resp.data[i]['role_cd'] = this.zoneusers[j]['role_cd']
          }
        }

      }
      this.statusArr = resp.data
      console.log(this.statusArr)

    } else {
      // this.toastr.errorToastr(resp['data'])
    }
  }
  async print_running_bill(element, selectedTenderInfo, project_cd) {
    this.spinner.show();

    var ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    var b_acct_id = ebillUser.b_acct_id;
    var id = element['id']
    var bill_no = element['bill_no']


    console.log(element, selectedTenderInfo);


    //get All Work  Data********************
    await this.getAllWorkInfo(b_acct_id);

    //get All Party  Data********************
    await this.getAllparty(b_acct_id);

    //get All BOQ Item Data********************
    await this.getBoqItems(b_acct_id, selectedTenderInfo['tender_id']);

    await this.getApproveByDocLocalNumber(b_acct_id, element['id'], selectedTenderInfo['work_id'], project_cd);



    ///Map Data On Running Bill Object******
    for (var i = 0; i < this.boqItems.length; i++) {
      this.runningBill[i] = Object.assign(this.boqItems[i])
      this.runningBill[i]['billRate'] = 0;
      this.runningBill[i]['billCurrent'] = 0;
      this.runningBill[i]['billPrev'] = 0;
    }


    //get All Previous Bill Data********************
    var obj = new Object();
    obj['doc_local_no'] = element.id;
    obj['b_acct_id'] = b_acct_id;
    obj['doc_type'] = 'EBILL';
    await this.getPreviousBillItems(id, b_acct_id, bill_no, selectedTenderInfo['tender_id']);





    var account_name=ebillUser['account_name'];
    var account_short_name=ebillUser['account_short_name'];
    var txt = account_name + "(" +account_short_name+ ") \n";
   // var txt = "LUCKNOW DEVELOPMENT AUTHORITY" + "(" + "LDA" + ") , LUCKNOW\n" + "VIPIN KHAND,GOMTI NAGAR , LUCKNOW - 226010";
    var dd = {
      pageSize: 'A3',
      header: function (currentPage, pageCount) {
        var arr = []
        var obj = { text: txt, alignment: 'center', margin: [72, 40], fontSize: 15, bold: true };
        arr.push(obj);
        return arr;
      },
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      content: [

      ]
    };


    let h1txt = ''
    if(element['final_ind'] == 1)  h1txt =  'FINAL BILL FOR FILE/EMB NO - ' + selectedTenderInfo['already_emb']
    else  h1txt =  'RUNNING BILL FOR FILE/EMB NO - ' + selectedTenderInfo['already_emb']

    var header1 = {
      columns: [
        {
          width: '*',
          text: h1txt,
          bold: true,
          alignment: 'center'
        }

      ],

    }


    var tbl = {

      fontSize: 10,
      table: {

        headerRows: 0,
        widths: [370, 375],

        body: [



        ]
      }
    };

    var workObj = this.workObj[selectedTenderInfo['work_id']];
    var partyObj = this.partyObj[selectedTenderInfo['party_id']];
if(partyObj == undefined) partyObj = 'Vendor Not Mapped'
    var arr = [];
    arr.push({ text: "Name Of Contractor ", bold: true });
    arr.push(partyObj);
    tbl.table.body.push(arr);
    var arr = [];
    arr.push({ text: "Name Of Work ", bold: true });
    arr.push(workObj['work_order_name']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Bill No ", bold: true });
    arr.push(element['bill_no']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Budget Head ", bold: true });
    arr.push(workObj['budget_cd']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Budget Name ", bold: true });
    arr.push(workObj['budget_name']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Estimate No ", bold: true });
    arr.push('');
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Work Order No ", bold: true });
    arr.push(workObj['work_order_no']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Agreement Dated ", bold: true });
    arr.push(workObj['agr_dt']);
    tbl.table.body.push(arr);




    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });


    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push({ text: " " });
    dd.content.push(tbl);



    dd.content.push({ text: " " });
    dd.content.push({ text: " " });

    var tbl1 = {

      fontSize: 10,
      table: {
        headerRows: 3,
        widths: [40, 40, 40, 250, 50, 50, 70, 70, 70],
        body: [
          [{ rowSpan: 3, text: 'upto date Qty' }, { rowSpan: 3, text: 'Paid Last Qty', alignment: 'Right' }, { rowSpan: 3, text: 'To Pay Qty ', alignment: 'right' }, { rowSpan: 3, text: 'Items', alignment: 'center' }, { rowSpan: 3, text: 'Rate', alignment: 'right' }, { text: 'Per', rowSpan: 3 }, { text: 'AMOUNT', alignment: 'center', colSpan: 3 }, {}, {}],
          ['', {}, {}, {}, {}, '', { text: 'Upto Date Amount', alignment: 'center' }, { text: 'Paid Last Amount', alignment: 'center' }, { text: 'To pay Amount', alignment: 'center' }],
          ['', {}, {}, {}, {}, '', { text: 'Rs.', alignment: 'center' }, { text: 'Rs.', alignment: 'center' }, { text: 'Rs.', alignment: 'center' }]

        ],
      }
    };



    dd.content.push(tbl1);
    console.log(this.runningBill)
    var extra_itemarr = []
    var printObj = { uptodatetotal: 0, lastpaidtotal: 0, topaytotal: 0, c1Over: 0, c2Over: 0, c3Over: 0, c1AfterOver: 0, c2AfterOver: 0, c3AfterOver: 0, c1PreGst: 0, c2PreGst: 0, c3PreGst: 0, c1GTotal: 0, c2GTotal: 0, c3GTotal: 0, c1CGST: 0, c2CGST: 0, c3CGST: 0, c1SGST: 0, c2SGST: 0, c3SGST: 0, c1WithHeld: 0, c2WithHeld: 0, c3WithHeld: 0, c1Sec: 0, c2Sec: 0, c3Sec: 0, c1AfterGST: 0, c2AfterGST: 0, c3AfterGST: 0, c1Net: 0, c2Net: 0, c3Net: 0, c1Ded: 0, c2Ded: 0, c3Ded: 0 }
    for (var i = 0; i < this.runningBill.length; i++) {
      if (this.runningBill[i]['currbillamt'] != 0 || this.runningBill[i]['uptodatebillamt'] != 0) {
        if(this.runningBill[i]['is_extra_item'] == 1){
          extra_itemarr.push(this.runningBill[i])
          continue;
          }
        var arr = []
        arr.push((this.alreadypaid[this.runningBill[i]['sno']] + this.runningBill[i]['billCurrent'] + this.runningBill[i]['billPrev']).toFixed(3));
        arr.push({ text: (this.alreadypaid[this.runningBill[i]['sno']] + this.runningBill[i]['billPrev']).toFixed(3), alignment: 'right' });
        arr.push((this.runningBill[i]['billCurrent']).toFixed(3));
        arr.push({ text: '(' + this.runningBill[i]['sno'] + ') ' + this.runningBill[i]['item_desc'], alignment: 'left' });//this.runningBill[i]['quantity']
        arr.push({ text: this.runningBill[i]['eff_rate'], alignment: 'right' });//
        arr.push({ text: this.runningBill[i]['unit'], alignment: 'right' });//this.runningBill[i]['billPrev'] + this.runningBill[i]['billCurrent']
        arr.push({ text: Number((this.runningBill[i]['uptodatebillamt']).toFixed(2)), alignment: 'right' });
        printObj['uptodatetotal'] = printObj['uptodatetotal'] + Number((Number(this.runningBill[i]['uptodatebillamt']).toFixed(2)))
        arr.push({ text: Number((this.runningBill[i]['prevbillamt']).toFixed(2)), alignment: 'right' });
        printObj['lastpaidtotal'] = printObj['lastpaidtotal'] + Number((this.runningBill[i]['prevbillamt']).toFixed(2))
        arr.push({ text: (this.runningBill[i]['currbillamt']).toFixed(2), alignment: 'right' });
        printObj['topaytotal'] = printObj['topaytotal'] + Number((this.runningBill[i]['currbillamt']).toFixed(2))
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
    }
    var arrtotal = []
    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push({ text: 'Total', alignment: 'right', bold: true, colSpan: 3 })
    arrtotal.push('')
    arrtotal.push('')

    arrtotal.push({ text: Number(printObj['uptodatetotal'].toFixed(2)), alignment: 'right' })
    arrtotal.push({ text: Number(printObj['lastpaidtotal'].toFixed(2)), alignment: 'right' })
    arrtotal.push({ text: Number(printObj['topaytotal'].toFixed(2)), alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arrtotal);
    let labuor_cess = 0
    if(selectedTenderInfo['labour_cess_flag'] == 1) {
        labuor_cess  =element['labuor_cess']
    var arrtotal = []
    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push({ text: "Add @ "+selectedTenderInfo['labour_cess']+" % Labour Cess", alignment: 'right', bold: true, colSpan: 3 })
    arrtotal.push('')
    arrtotal.push('')

    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push({ text: Number(labuor_cess.toFixed(0)), alignment: 'right' })

    dd.content[dd.content.length - 1].table.body.push(arrtotal);
  }
    var TOTALoverunderpertotalcurrentbill = 0
    var TOTALoverunderpertotallastbill = 0
    var TOTALoverunderpertotaluptodatebill = 0
    var updatetotal = printObj['uptodatetotal']
    var lastpaidtotal = printObj['lastpaidtotal']
    var topaytotal = printObj['topaytotal']
    printObj['uptodatetotal'] = 0
    printObj['lastpaidtotal'] = 0
    printObj['topaytotal'] = 0
    var finaloverunder = new Object()
    finaloverunder['LS'] = new Object()
    finaloverunder['ATPR'] = new Object()
    finaloverunder['EXC'] = new Object()

    for (let i = 0; i < this.runningBill.length; i++) {
      var overunderpertotalcurrentbill = 0
      var overunderpertotallastbill = 0
      var overunderpertotaluptodatebill = 0
      if (this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] == -1) {
        printObj['uptodatetotal'] = printObj['uptodatetotal'] + Number((this.runningBill[i]['uptodatebillamt']).toFixed(2))
        printObj['lastpaidtotal'] = printObj['lastpaidtotal'] + Number((this.runningBill[i]['prevbillamt']).toFixed(2))
        printObj['topaytotal'] = printObj['topaytotal'] + Number((this.runningBill[i]['currbillamt']).toFixed(2))
      } else {
        if (this.overunderobj[this.runningBill[i]['sno']]['over_under'] == 'LS') {
          if (finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']] == undefined) {
            finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']] = new Object()
            finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] = 0
            finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] = 0
            finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] = 0
          }

          overunderpertotalcurrentbill = Number(((Number((Number((this.runningBill[i]['currbillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          overunderpertotallastbill = Number(((Number((Number((this.runningBill[i]['prevbillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          overunderpertotaluptodatebill = Number(((Number((Number((this.runningBill[i]['uptodatebillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          TOTALoverunderpertotalcurrentbill = TOTALoverunderpertotalcurrentbill - overunderpertotalcurrentbill
          TOTALoverunderpertotallastbill = TOTALoverunderpertotallastbill - overunderpertotallastbill
          TOTALoverunderpertotaluptodatebill = TOTALoverunderpertotaluptodatebill - overunderpertotaluptodatebill
          finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] = finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] + overunderpertotalcurrentbill
          finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] = finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] + overunderpertotallastbill
          finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] = finaloverunder['LS'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] + overunderpertotaluptodatebill

        }
        if (this.overunderobj[this.runningBill[i]['sno']]['over_under'] == 'EXC') {
          if (finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']] == undefined) {
            finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']] = new Object()
            finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] = 0
            finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] = 0
            finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] = 0
          }

          overunderpertotalcurrentbill = Number(((Number((Number((this.runningBill[i]['currbillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          overunderpertotallastbill = Number(((Number((Number((this.runningBill[i]['prevbillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          overunderpertotaluptodatebill = Number(((Number((Number((this.runningBill[i]['uptodatebillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          TOTALoverunderpertotalcurrentbill = TOTALoverunderpertotalcurrentbill + overunderpertotalcurrentbill
          TOTALoverunderpertotallastbill = TOTALoverunderpertotallastbill + overunderpertotallastbill
          TOTALoverunderpertotaluptodatebill = TOTALoverunderpertotaluptodatebill + overunderpertotaluptodatebill
          finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] = finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] + overunderpertotalcurrentbill
          finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] = finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] + overunderpertotallastbill
          finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] = finaloverunder['EXC'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] + overunderpertotaluptodatebill


        } if (this.overunderobj[this.runningBill[i]['sno']]['over_under'] == 'ATPR') {
          if (finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']] == undefined) {
            finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']] = new Object()
            finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] = 0
            finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] = 0
            finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] = 0
          }
          overunderpertotalcurrentbill = Number(((Number((Number((this.runningBill[i]['currbillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          overunderpertotallastbill = Number(((Number((Number((this.runningBill[i]['prevbillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          overunderpertotaluptodatebill = Number(((Number((Number((this.runningBill[i]['uptodatebillamt']).toFixed(2)) * this.overunderobj[this.runningBill[i]['sno']]['over_under_per'] / 100).toFixed(2)))).toFixed(2))
          finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] = finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotalcurrentbill'] + overunderpertotalcurrentbill
          finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] = finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotallastbill'] + overunderpertotallastbill
          finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] = finaloverunder['ATPR'][this.overunderobj[this.runningBill[i]['sno']]['over_under_per']]['overunderpertotaluptodatebill'] + overunderpertotaluptodatebill


        }
      }

    }
    if (selectedTenderInfo['over_under'] == 'EXC') {
      printObj['c1Over'] = Number((printObj['uptodatetotal'] * selectedTenderInfo['over_under_per'] / 100).toFixed(2));
      printObj['c2Over'] = Number((printObj['lastpaidtotal'] * selectedTenderInfo['over_under_per'] / 100).toFixed(2));
      printObj['c3Over'] = Number((printObj['topaytotal'] * selectedTenderInfo['over_under_per'] / 100).toFixed(2));
      printObj['c1AfterOver'] = Number((updatetotal + printObj['c1Over']).toFixed(2));
      printObj['c2AfterOver'] = Number((lastpaidtotal + printObj['c2Over']).toFixed(2));
      printObj['c3AfterOver'] = Number((topaytotal + printObj['c3Over']).toFixed(2));
      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: 'Add @ ' + selectedTenderInfo['over_under_per'] + ' %', alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')

      ctotal.push({ text: printObj['c3Over'], alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);



    } else if (selectedTenderInfo['over_under'] == 'LS') {
      printObj['c1Over'] = Number((printObj['uptodatetotal'] * selectedTenderInfo['over_under_per'] / 100).toFixed(2));
      printObj['c2Over'] = Number((printObj['lastpaidtotal'] * selectedTenderInfo['over_under_per'] / 100).toFixed(2));
      printObj['c3Over'] = Number((printObj['topaytotal'] * selectedTenderInfo['over_under_per'] / 100).toFixed(2));
      printObj['c1AfterOver'] = Number((updatetotal - printObj['c1Over']).toFixed(2));
      printObj['c2AfterOver'] = Number((lastpaidtotal - printObj['c2Over']).toFixed(2));
      printObj['c3AfterOver'] = Number((topaytotal - printObj['c3Over']).toFixed(2));
      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: 'Sub @ ' + selectedTenderInfo['over_under_per'] + ' %', alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')

      ctotal.push({ text: printObj['c3Over'], alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);

    } else {
      printObj['c1Over'] = 0;
      printObj['c2Over'] = 0;
      printObj['c3Over'] = 0;
      printObj['c1AfterOver'] = Number((updatetotal - printObj['c1Over']).toFixed(2));
      printObj['c2AfterOver'] = Number((lastpaidtotal - printObj['c2Over']).toFixed(2));
      printObj['c3AfterOver'] = Number((topaytotal - printObj['c3Over']).toFixed(2));
      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: ' At Par @ ', alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')

      ctotal.push({ text: 0, alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);

    }
    var ctotal = []
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push({ text: ' Amount After Over Under ', alignment: 'right', bold: true, colSpan: 3 })
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    /*  ctotal.push({ text: Number((printObj['c1AfterOver']  * this.selectedTender['discount'] / 100).toFixed(2)), alignment: 'right', })
     ctotal.push({ text: Number((printObj['c2AfterOver'] * this.selectedTender['discount'] / 100).toFixed(2)), alignment: 'right' }) */
    ctotal.push({ text: Number((printObj['c3AfterOver']).toFixed(2)), alignment: 'right' })

    dd.content[dd.content.length - 1].table.body.push(ctotal);
    var ctotal = []
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push({ text: ' EXTRA ITEMS ', alignment: 'left', bold: true, colSpan: 3 })
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    /*  ctotal.push({ text: Number((printObj['c1AfterOver']  * this.selectedTender['discount'] / 100).toFixed(2)), alignment: 'right', })
     ctotal.push({ text: Number((printObj['c2AfterOver'] * this.selectedTender['discount'] / 100).toFixed(2)), alignment: 'right' }) */
    ctotal.push('')

    dd.content[dd.content.length - 1].table.body.push(ctotal);
    printObj['uptodatetotalextra'] = 0
    printObj['lastpaidtotalextra'] = 0
    printObj['topaytotalextra'] = 0
    for (var i = 0; i < extra_itemarr.length; i++) {
      if (extra_itemarr[i]['currbillamt'] != 0 || extra_itemarr[i]['uptodatebillamt'] != 0) {
      /* if(extra_itemarr[i]['is_extra_item'] == 1){
      extra_itemarr.push(extra_itemarr[i])
      continue;
      } */
        var arr = []
        arr.push((this.alreadypaid[extra_itemarr[i]['sno']] + extra_itemarr[i]['billCurrent'] + extra_itemarr[i]['billPrev']).toFixed(3));
        arr.push({ text: (this.alreadypaid[extra_itemarr[i]['sno']] + extra_itemarr[i]['billPrev']).toFixed(3), alignment: 'right' });
        arr.push((extra_itemarr[i]['billCurrent']).toFixed(3));
        arr.push({ text: '(' + extra_itemarr[i]['sno'] + ') ' + extra_itemarr[i]['item_desc'], alignment: 'left' });//extra_itemarr[i]['quantity']
        arr.push({ text: extra_itemarr[i]['eff_rate'], alignment: 'right' });//
        arr.push({ text: extra_itemarr[i]['unit'], alignment: 'right' });//extra_itemarr[i]['billPrev'] + extra_itemarr[i]['billCurrent']
        arr.push({ text: Number((extra_itemarr[i]['uptodatebillamt']).toFixed(2)), alignment: 'right' });
        printObj['uptodatetotalextra'] = printObj['uptodatetotalextra'] + Number((Number(extra_itemarr[i]['uptodatebillamt']).toFixed(2)))
        arr.push({ text: Number((extra_itemarr[i]['prevbillamt']).toFixed(2)), alignment: 'right' });
        printObj['lastpaidtotalextra'] = printObj['lastpaidtotalextra'] + Number((extra_itemarr[i]['prevbillamt']).toFixed(2))
        arr.push({ text: (extra_itemarr[i]['currbillamt']).toFixed(2), alignment: 'right' });
        printObj['topaytotalextra'] = printObj['topaytotalextra'] + Number((extra_itemarr[i]['currbillamt']).toFixed(2))
        // arr.push({ text: (extra_itemarr[i]['billRate'] * extra_itemarr[i]['billCurrent']).toFixed(2), alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
    }
    let labuor_cessextra = 0
    if(selectedTenderInfo['labour_cess_flag'] == 1) {
      labuor_cessextra  = Number(((selectedTenderInfo['labour_cess'] * Number(printObj['topaytotalextra'].toFixed(2)) ) / 100 ).toFixed(2))
  var arrtotal = []
  arrtotal.push('')
  arrtotal.push('')
  arrtotal.push('')
  arrtotal.push({ text: "Add @ "+selectedTenderInfo['labour_cess']+" % Labour Cess", alignment: 'right', bold: true, colSpan: 3 })
  arrtotal.push('')
  arrtotal.push('')

  arrtotal.push('')
  arrtotal.push('')
  arrtotal.push({ text: Number(labuor_cessextra.toFixed(0)), alignment: 'right' })

  dd.content[dd.content.length - 1].table.body.push(arrtotal);
}
    var lsarr = Object.keys(finaloverunder['LS'])
    var excarr = Object.keys(finaloverunder['EXC'])
    var atpararr = Object.keys(finaloverunder['ATPR'])
    for (let i = 0; i < lsarr.length; i++) {
      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: 'Sub @ ' + lsarr[i] + ' % ', alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: finaloverunder['LS'][lsarr[i]]['overunderpertotalcurrentbill'].toFixed(2), alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);

    }
    for (let i = 0; i < excarr.length; i++) {
      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: 'Add @ ' + excarr[i] + ' % ', alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: finaloverunder['EXC'][excarr[i]]['overunderpertotalcurrentbill'].toFixed(2), alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);

    }
    if (atpararr.length > 0) {
      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: ' At Par @ ', alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')

      ctotal.push({ text: 0, alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);

    }
   
   /*  printObj['c1AfterOver'] = Number((printObj['c1AfterOver'] + TOTALoverunderpertotaluptodatebill).toFixed(2));
    printObj['c2AfterOver'] = Number((printObj['c2AfterOver'] + TOTALoverunderpertotallastbill).toFixed(2));
    printObj['c3AfterOver'] = Number((printObj['c3AfterOver'] + TOTALoverunderpertotalcurrentbill).toFixed(2)); */

    var ctotal = []
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push({ text: ' Amount After Over Under in Extra Items', alignment: 'right', bold: true, colSpan: 3 })
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    /*  ctotal.push({ text: Number((printObj['c1AfterOver']  * this.selectedTender['discount'] / 100).toFixed(2)), alignment: 'right', })
     ctotal.push({ text: Number((printObj['c2AfterOver'] * this.selectedTender['discount'] / 100).toFixed(2)), alignment: 'right' }) */
    ctotal.push({ text: Number((TOTALoverunderpertotalcurrentbill + printObj['topaytotalextra']).toFixed(2)), alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(ctotal);
    printObj['c1AfterOver'] = Number((printObj['c1AfterOver'] + TOTALoverunderpertotaluptodatebill + printObj['uptodatetotalextra']).toFixed(2));
    printObj['c2AfterOver'] = Number((printObj['c2AfterOver'] + TOTALoverunderpertotallastbill + printObj['lastpaidtotalextra']).toFixed(2));
    printObj['c3AfterOver'] = Number((printObj['c3AfterOver'] + TOTALoverunderpertotalcurrentbill + printObj['topaytotalextra']).toFixed(2));

    var ctotal = []
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push({ text: ' Amount After Over Under ', alignment: 'right', bold: true, colSpan: 3 })
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')
    ctotal.push('')

    ctotal.push({ text: Number((printObj['c3AfterOver']).toFixed(2)), alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(ctotal);

    if (selectedTenderInfo['discount'] != 0) {

      var ctotal = []
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push({ text: ' Discount @ ' + selectedTenderInfo['discount'], alignment: 'right', bold: true, colSpan: 3 })
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')
      ctotal.push('')

      ctotal.push({ text: Number((printObj['c3AfterOver'] * selectedTenderInfo['discount'] / 100).toFixed(2)), alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(ctotal);
      printObj['c1AfterOver'] = Number((printObj['c1AfterOver'] - ((printObj['c1AfterOver'] * selectedTenderInfo['discount'] / 100))).toFixed(2))
      printObj['c2AfterOver'] = Number((printObj['c2AfterOver'] - ((printObj['c2AfterOver'] * selectedTenderInfo['discount'] / 100))).toFixed(2))
      printObj['c3AfterOver'] = Number((printObj['c3AfterOver'] - ((printObj['c3AfterOver'] * selectedTenderInfo['discount'] / 100))).toFixed(2))
    }

    var total1 = []
    total1.push('')
    total1.push('')
    total1.push('')
    total1.push({ text: 'Sub Total', alignment: 'right', bold: true, colSpan: 3 });
    total1.push('')
    total1.push('');
    total1.push('')
    total1.push('');

    total1.push({ text: printObj['c3AfterOver'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(total1);
    var total1 = []
    total1.push('')
    total1.push('')
    total1.push('')
    total1.push({ text: 'Temporary With Held\n Remark :' + element['temp_withheld_remark'], alignment: 'right', bold: true, colSpan: 3 });
    total1.push('')
    total1.push('');
    total1.push('')
    total1.push('');

    total1.push({ text: element['temp_withheld'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(total1);
    var total1 = []
    total1.push('')
    total1.push('')
    total1.push('')
    total1.push({ text: 'Permanent Deduction \n Remark :' + element['per_withheld_remark'], alignment: 'right', bold: true, colSpan: 3 });
    total1.push('')
    total1.push('');
    total1.push('')
    total1.push('');

    total1.push({ text: element['per_withheld'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(total1);
    var total1 = []
    total1.push('')
    total1.push('')
    total1.push('')
    total1.push({ text: 'Release Previous Temporary Withheld', alignment: 'right', bold: true, colSpan: 3 });
    total1.push('')
    total1.push('');
    total1.push('')
    total1.push('');

    total1.push({ text: element['rel_temp_withheld'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(total1);
    printObj['c1PreGst'] = element['pre_gst_amt']
    printObj['c2PreGst'] = element['pre_gst_amt']
    printObj['c3PreGst'] = element['pre_gst_amt']
    printObj['c1GTotal'] = Number((printObj['c1AfterOver'] - printObj['c1PreGst']).toFixed(2))
    printObj['c2GTotal'] = Number((printObj['c2AfterOver'] - printObj['c2PreGst']).toFixed(2))
    printObj['c3GTotal'] = Number((printObj['c3AfterOver'] - printObj['c3PreGst'] + element['rel_temp_withheld'] - element['per_withheld'] - element['temp_withheld']).toFixed(2))

    var arr = []
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: 'Deduct Pre GST @ ' + element['pre_gst'] + " %", alignment: 'right', bold: true, colSpan: 3 })
    arr.push('')
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: printObj['c3PreGst'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arr);
    arr = []
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: 'G. Total ', alignment: 'right', bold: true, colSpan: 3 })
    arr.push('')
    arr.push('')
    arr.push('')
    arr.push('')
    printObj['c3GTotal'] = Number((printObj['c3GTotal']).toFixed(0))

    arr.push({ text: printObj['c3GTotal'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arr);
    printObj['c1CGST'] = Number((printObj['c1GTotal'] * element['cgst_per'] / 100).toFixed(0));
    printObj['c2CGST'] = Number((printObj['c2GTotal'] * element['cgst_per'] / 100).toFixed(0));

    printObj['c3CGST'] = Number((printObj['c3GTotal'] * element['cgst_per'] / 100).toFixed(0));
    printObj['c1SGST'] = Number((printObj['c1GTotal'] * element['sgst_per'] / 100).toFixed(0));
    printObj['c2SGST'] = Number((printObj['c2GTotal'] * element['sgst_per'] / 100).toFixed(0));

    printObj['c3SGST'] = Number((printObj['c3GTotal'] * element['sgst_per'] / 100).toFixed(0));
    printObj['c1IGST'] = Number((printObj['c1GTotal'] * element['igst_per'] / 100).toFixed(0));
    printObj['c2IGST'] = Number((printObj['c2GTotal'] * element['igst_per'] / 100).toFixed(0));
    printObj['c3IGST'] = Number((printObj['c3GTotal'] * element['igst_per'] / 100).toFixed(0));
    printObj['c1WithHeld'] = element['add_with_held'];
    printObj['c2WithHeld'] = 0;
    printObj['c3WithHeld'] = element['add_with_held'];
    printObj['c1Sec'] = element['add_security'];
    printObj['c2Sec'] = 0;
    printObj['c3Sec'] = element['add_security'];

    printObj['c1AfterGST'] = Number((printObj['c1GTotal'] + printObj['c1CGST'] + printObj['c1SGST'] + printObj['c1IGST'] + printObj['c1Sec'] + printObj['c1WithHeld']).toFixed(2));
    printObj['c2AfterGST'] = Number((printObj['c2GTotal'] + printObj['c2CGST'] + printObj['c2SGST'] + printObj['c2IGST'] + printObj['c2Sec'] + printObj['c2WithHeld']).toFixed(2));
    printObj['c3AfterGST'] = Number((printObj['c3GTotal'] + element['cgst'] + element['sgst'] + element['igst'] + printObj['c3Sec'] + printObj['c3WithHeld']).toFixed(2));
    var data = JSON.parse(element['gst_data'])
    for (let o = 0; o < data.length; o++) {


      if (data[o]['cgst_table'] > 0) {
        arr = [];
        arr.push('')
        arr.push('')
        arr.push('')

        arr.push({ text: 'CGST on ' + data[o]['tax_amt'] + ' @ ' + data[o]['cgst_per_table'] + "%", alignment: 'right', bold: true, colSpan: 3 })
        arr.push('')
        arr.push('')
        arr.push('')
        arr.push('')
        arr.push({ text: data[o]['cgst_table'], alignment: 'right' })
        dd.content[dd.content.length - 1].table.body.push(arr);

        arr = [];
        arr.push('')
        arr.push('')
        arr.push('')

        arr.push({ text: 'SGST on ' + data[o]['tax_amt'] + ' @ ' + data[o]['sgst_per_table'] + "%", alignment: 'right', bold: true, colSpan: 3 })
        arr.push('')
        arr.push('')
        arr.push('')
        arr.push('')
        arr.push({ text: data[o]['sgst_table'], alignment: 'right' })
        dd.content[dd.content.length - 1].table.body.push(arr);
      } else {
        arr = [];
        arr.push('')
        arr.push('')
        arr.push('')

        arr.push({ text: 'IGST on ' + data[o]['tax_amt'] + ' @ ' + data[o]['igst_per_table'] + "%", alignment: 'right', bold: true, colSpan: 3 })
        arr.push('')
        arr.push('')
        arr.push('')
        arr.push('')
        arr.push({ text: data[o]['igst_table'], alignment: 'right' })
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
    }
    if (data.length == 0) {
      arr = [];
      arr.push('')
      arr.push('')
      arr.push('')

      arr.push({ text: 'CGST @ ' + element['cgst_per'] + "%", alignment: 'right', bold: true, colSpan: 3 })
      arr.push('')
      arr.push('')
      arr.push('')
      arr.push('')
      arr.push({ text: printObj['c3CGST'], alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(arr);

      arr = [];
      arr.push('')
      arr.push('')
      arr.push('')

      arr.push({ text: 'SGST @ ' + element['sgst_per'] + "%", alignment: 'right', bold: true, colSpan: 3 })
      arr.push('')
      arr.push('')
      arr.push('')
      arr.push('')

      arr.push({ text: printObj['c3SGST'], alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(arr);
      arr = [];
      arr.push('')
      arr.push('')
      arr.push('')

      arr.push({ text: 'IGST @ ' + element['igst_per'] + "%", alignment: 'right', bold: true, colSpan: 3 })
      arr.push('')
      arr.push('')
      arr.push('')
      arr.push('')

      arr.push({ text: printObj['c3IGST'], alignment: 'right' })
      dd.content[dd.content.length - 1].table.body.push(arr)
    }
    arr = [];
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: "Add Previous With Held", alignment: 'right', bold: true, colSpan: 3 })
    arr.push('')
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: printObj['c3WithHeld'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arr);



    arr = [];
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: "Add Previous With Held Security", alignment: 'right', bold: true, colSpan: 3 })
    arr.push('')
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: printObj['c3Sec'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arr);




    arr = [];
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: "Total Payable", alignment: 'right', bold: true, colSpan: 3 })
    arr.push('')
    arr.push('')
    arr.push('')
    arr.push('')

    arr.push({ text: (printObj['c3AfterGST'] + Number(labuor_cess.toFixed(0)) + Number(labuor_cessextra.toFixed(0))).toFixed(0), alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arr);
    await this.getDeductions(b_acct_id, id)
    await this.getAllDed(b_acct_id)
    var ded = 0
    this.dedObj[-1] = {}
    this.dedObj[-1]['ded_name'] = 'LABOUR CESS'
    for (let j = 0; j < this.allDed.length; j++) {
      if (this.allDed[j]['type'] == 'FIXED') {
        var total3 = []
        total3.push('')
        total3.push('')
        total3.push('')
        total3.push({ text: this.dedObj[this.allDed[j]['deduction_id']]['ded_name'], alignment: 'right', bold: true, colSpan: 3 })
        total3.push('')
        total3.push('')
        total3.push('')
        total3.push('')

        total3.push({ text: (this.allDed[j]['amt']).toFixed(0), alignment: 'right' })
        printObj['c1Ded'] += this.allDed[j]['amt']
        printObj['c3Ded'] += this.allDed[j]['amt']
        dd.content[dd.content.length - 1].table.body.push(total3);
      } else {
        var FirstDed = Number((this.allDed[j]['amt']).toFixed(2))
        var SecondDed = 0
        var ThirdDed = Number((this.allDed[j]['amt']).toFixed(2))
        var total3 = []
        total3.push('')
        total3.push('')
        total3.push('')
        total3.push({ text: 'Less ' + this.dedObj[this.allDed[j]['deduction_id']]['ded_name'] + ' @' + this.allDed[j]['rate'] + ' %', alignment: 'right', bold: true, colSpan: 3 })
        total3.push('')
        total3.push('')
        total3.push('')
        total3.push('')

        total3.push({ text: ThirdDed, alignment: 'right' })
        dd.content[dd.content.length - 1].table.body.push(total3);

        printObj['c1Ded'] += FirstDed
        printObj['c2Ded'] += SecondDed
        printObj['c3Ded'] += ThirdDed
      }

    }
    printObj['c1Net'] = Number((printObj['c1AfterGST'] - printObj['c1Ded']).toFixed(2))
    printObj['c2Net'] = Number((printObj['c2AfterGST'] - printObj['c2Ded']).toFixed(2))
    printObj['c3Net'] = Number((printObj['c3AfterGST'] - printObj['c3Ded'] - element['withheldamount']).toFixed(2))

    var withHeld = []


    withHeld.push('')
    withHeld.push('')
    withHeld.push('')

    withHeld.push({ text: 'With Held Amount', alignment: 'right', bold: true, colSpan: 3 })
    withHeld.push('')
    withHeld.push('')
    withHeld.push('')
    withHeld.push('')

    withHeld.push({ text: element['withheldamount'], alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(withHeld);


    var total6 = []
    total6.push('')
    total6.push('')
    total6.push('')

    total6.push({ text: 'Total Net Payable', alignment: 'right', bold: true, colSpan: 3 })
    total6.push('')
    total6.push('')
    total6.push('')
    total6.push('')

    total6.push({ text: Number((printObj['c3Net'] + Number(labuor_cess.toFixed(0)) + Number(labuor_cessextra.toFixed(0))).toFixed(0)), alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(total6);
    dd.content.push({ text: " " });

    dd.content.push({ text: " " });

    dd.content.push({ text: " " });

    dd.content.push({ text: " " });

    dd.content.push({ text: " " });
    var header10 = {
      columns: [
        {
          width: '*',
          text: 'NOTESHEET',
          bold: true,
          alignment: 'center'
        }

      ],

    }
    dd.content.push(header10);
    console.log(this.statusArr)
    for (let i = 0; i < this.statusArr.length; i++) {
      dd.content.push({ text: " " });
      if (this.statusArr[i]['status'] == 'PENDING') {
        continue;
      }
      if (this.statusArr[i]['undertaking'] == null || this.statusArr[i]['undertaking'] == undefined) continue;
      var header1 = {
        columns: [
          {
            width: '*',
            text: 'Name : ' + this.statusArr[i]['name'] + '-' + this.statusArr[i]['role_cd'],
            bold: true,
            alignment: 'left'
          }

        ],

      }
      dd.content.push(header1);
      if (this.statusArr[i]['role_cd'] == 'Contractor') {
        this.mainService.roleCodeToRoleDescription[this.statusArr[i]['role_cd']] = 'Contractor'
      }
      var undertakings = []
      //console.log(JSON.parse(this.statusArr[i]['undertakings'])['data'])
      if (this.statusArr[i]['undertaking'] != null && this.statusArr[i]['undertaking'] != undefined) {
        if (JSON.parse(this.statusArr[i]['undertaking']) != undefined) {
          undertakings = JSON.parse(this.statusArr[i]['undertaking'])

        } else {
          undertakings = []
        }
      } else {


      }
      console.log(data)
      if (undertakings.length > 0) {
        var tbl2 = {

          //layout: 'lightHorizontalLines',
          fontSize: 10,
          table: {

            headerRows: 0,

            widths: [70, 675],

            body: [
              [{ bold: true, text: 'YES/NO' }, { bold: true, text: 'DESCRIPTION', alignment: 'Right' }],



            ]
          }
        };
        for (let j = 0; j < undertakings.length; j++) {
          var arr = [];
          if (undertakings[j]['check'] == true) {
            arr.push({ text: "YES" });

          } else {
            arr.push({ text: "NO" });

          }
          arr.push(undertakings[j]['desc']);
          tbl2.table.body.push(arr);

        }
        dd.content.push({ text: " " });
        dd.content.push(tbl2);
      }
      dd.content.push({ text: " " });

      console.log(this.statusArr)
      if (this.statusArr[i]['undertaking'] != null && this.statusArr[i]['undertaking'] != undefined) {
        if (this.statusArr[i]['field_value'] != undefined) {
          var header2 = {
            columns: [
              {
                width: '*',
                text: 'Passsed for Rs.' + this.statusArr[i]['field_value'],
                bold: true,
                alignment: 'left'
              }
            ],
          }
          dd.content.push(header2);
          dd.content.push({ text: " " });
        }
      }
      var header3 = {
        columns: [
          {
            width: '*',
            text: this.mainService.roleCodeToRoleDescription[this.statusArr[i]['role_cd']],
            bold: true,
            alignment: 'right'
          }

        ],

      }
      dd.content.push(header3);
      dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });

    }
    // var header10 = {
    //   columns: [
    //     {
    //       width: '*',
    //       text: "Account Clerk",
    //       bold: true,
    //       alignment: 'center'
    //     },
    //     {
    //       width: '*',
    //       text: 'Adhishashi Abhiyanta(v)',
    //       bold: true,
    //       alignment: 'center'
    //     },
    //     {
    //       width: '*',
    //       text: 'Public Work Clerk',
    //       bold: true,
    //       alignment: 'center'
    //     },
    //     {
    //       width: '*',
    //       text: 'Contractor',
    //       bold: true,
    //       alignment: 'center'
    //     }

    //   ],


    // }
    // dd.content.push(header10);
    this.spinner.hide();

    pdfMake.createPdf(dd).download('running-bill' + '.pdf');
  }
  async print_abstractofcost(element, selectedTenderInfo) {
    this.spinner.show();

    var ebillUser = JSON.parse(localStorage.getItem('erpUser'));
    var b_acct_id = ebillUser.b_acct_id;
   // var id = element['id']
   // var bill_no = element['bill_no']


    console.log(element, selectedTenderInfo);


    //get All Work  Data********************
    await this.getAllWorkInfo(b_acct_id);

    //get All Party  Data********************
    await this.getAllparty(b_acct_id);

    //get All BOQ Item Data********************
   /*  await this.getBoqItems(b_acct_id, selectedTenderInfo['tender_id']);

    await this.getApproveByDocLocalNumber(b_acct_id, element['id'], selectedTenderInfo['work_id'], project_cd);
 */


  /*   ///Map Data On Running Bill Object******
    for (var i = 0; i < this.boqItems.length; i++) {
      this.runningBill[i] = Object.assign(this.boqItems[i])
      this.runningBill[i]['billRate'] = 0;
      this.runningBill[i]['billCurrent'] = 0;
      this.runningBill[i]['billPrev'] = 0;
    } */


    //get All Previous Bill Data********************
   /*  var obj = new Object();
    obj['doc_local_no'] = element.id;
    obj['b_acct_id'] = b_acct_id;
    obj['doc_type'] = 'EBILL';
    await this.getPreviousBillItems(id, b_acct_id, bill_no, selectedTenderInfo['tender_id']);

 */



    var account_name=ebillUser['account_name'];
    var account_short_name=ebillUser['account_short_name'];
    var txt = account_name + "(" +account_short_name+ ") \n";
   // var txt = "LUCKNOW DEVELOPMENT AUTHORITY" + "(" + "LDA" + ") , LUCKNOW\n" + "VIPIN KHAND,GOMTI NAGAR , LUCKNOW - 226010";
    var dd = {
      pageSize: 'A3',
      header: function (currentPage, pageCount) {
        var arr = []
        var obj = { text: txt, alignment: 'center', margin: [72, 40], fontSize: 15, bold: true };
        arr.push(obj);
        return arr;
      },
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      content: [

      ]
    };


    let h1txt = ''
    /* if(element['final_ind'] == 1)  h1txt =  'FINAL BILL FOR FILE/EMB NO - ' + selectedTenderInfo['already_emb']
    else */  h1txt =  'Abstract of Cost'

    var header1 = {
      columns: [
        {
          width: '*',
          text: h1txt,
          bold: true,
          alignment: 'center'
        }

      ],

    }


    var tbl = {

      fontSize: 10,
      table: {

        headerRows: 0,
        widths: [370, 375],

        body: [



        ]
      }
    };

    var workObj = this.workObj[selectedTenderInfo['work_id']];
    var partyObj = this.partyObj[selectedTenderInfo['party_id']];
if(partyObj == undefined) partyObj = 'Vendor Not Mapped'
    var arr = [];
    arr.push({ text: "Name Of Contractor ", bold: true });
    arr.push(partyObj);
    tbl.table.body.push(arr);
    var arr = [];
    arr.push({ text: "Name Of Work ", bold: true });
    arr.push(workObj['work_order_name']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Bill No ", bold: true });
    arr.push(element['bill_no']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Budget Head ", bold: true });
    arr.push(workObj['budget_cd']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Budget Name ", bold: true });
    arr.push(workObj['budget_name']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Estimate No ", bold: true });
    arr.push('');
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Work Order No ", bold: true });
    arr.push(workObj['work_order_no']);
    tbl.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Agreement Dated ", bold: true });
    arr.push(workObj['agr_dt']);
    tbl.table.body.push(arr);




    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });


    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push({ text: " " });
    dd.content.push(tbl);



    dd.content.push({ text: " " });
    dd.content.push({ text: " " });

    var tbl1 = {

      fontSize: 10,
      table: {
        headerRows: 3,
        widths: [40, 40, 40, 250, 50, 50, 70, 70, 70],
        body: [
          [{ rowSpan: 3, text: 'upto date Qty' }, { rowSpan: 3, text: 'Paid Last Qty', alignment: 'Right' }, { rowSpan: 3, text: 'To Pay Qty ', alignment: 'right' }, { rowSpan: 3, text: 'Items', alignment: 'center' }, { rowSpan: 3, text: 'Rate', alignment: 'right' }, { text: 'Per', rowSpan: 3 }, { text: 'AMOUNT', alignment: 'center', colSpan: 3 }, {}, {}],
          ['', {}, {}, {}, {}, '', { text: 'Upto Date Amount', alignment: 'center' }, { text: 'Paid Last Amount', alignment: 'center' }, { text: 'To pay Amount', alignment: 'center' }],
          ['', {}, {}, {}, {}, '', { text: 'Rs.', alignment: 'center' }, { text: 'Rs.', alignment: 'center' }, { text: 'Rs.', alignment: 'center' }]

        ],
      }
    };



    dd.content.push(tbl1);
    console.log(this.runningBill)
    var extra_itemarr = []
    var printObj = { uptodatetotal: 0, lastpaidtotal: 0, topaytotal: 0, c1Over: 0, c2Over: 0, c3Over: 0, c1AfterOver: 0, c2AfterOver: 0, c3AfterOver: 0, c1PreGst: 0, c2PreGst: 0, c3PreGst: 0, c1GTotal: 0, c2GTotal: 0, c3GTotal: 0, c1CGST: 0, c2CGST: 0, c3CGST: 0, c1SGST: 0, c2SGST: 0, c3SGST: 0, c1WithHeld: 0, c2WithHeld: 0, c3WithHeld: 0, c1Sec: 0, c2Sec: 0, c3Sec: 0, c1AfterGST: 0, c2AfterGST: 0, c3AfterGST: 0, c1Net: 0, c2Net: 0, c3Net: 0, c1Ded: 0, c2Ded: 0, c3Ded: 0 }
    for (var i = 0; i < this.runningBill.length; i++) {
      if (this.runningBill[i]['currbillamt'] != 0 || this.runningBill[i]['uptodatebillamt'] != 0) {
        if(this.runningBill[i]['is_extra_item'] == 1){
          extra_itemarr.push(this.runningBill[i])
          continue;
          }
        var arr = []
        arr.push((this.alreadypaid[this.runningBill[i]['sno']] + this.runningBill[i]['billCurrent'] + this.runningBill[i]['billPrev']).toFixed(3));
        arr.push({ text: (this.alreadypaid[this.runningBill[i]['sno']] + this.runningBill[i]['billPrev']).toFixed(3), alignment: 'right' });
        arr.push((this.runningBill[i]['billCurrent']).toFixed(3));
        arr.push({ text: '(' + this.runningBill[i]['sno'] + ') ' + this.runningBill[i]['item_desc'], alignment: 'left' });//this.runningBill[i]['quantity']
        arr.push({ text: this.runningBill[i]['eff_rate'], alignment: 'right' });//
        arr.push({ text: this.runningBill[i]['unit'], alignment: 'right' });//this.runningBill[i]['billPrev'] + this.runningBill[i]['billCurrent']
        arr.push({ text: Number((this.runningBill[i]['uptodatebillamt']).toFixed(2)), alignment: 'right' });
        printObj['uptodatetotal'] = printObj['uptodatetotal'] + Number((Number(this.runningBill[i]['uptodatebillamt']).toFixed(2)))
        arr.push({ text: Number((this.runningBill[i]['prevbillamt']).toFixed(2)), alignment: 'right' });
        printObj['lastpaidtotal'] = printObj['lastpaidtotal'] + Number((this.runningBill[i]['prevbillamt']).toFixed(2))
        arr.push({ text: (this.runningBill[i]['currbillamt']).toFixed(2), alignment: 'right' });
        printObj['topaytotal'] = printObj['topaytotal'] + Number((this.runningBill[i]['currbillamt']).toFixed(2))
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
    }
    var arrtotal = []
    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push('')
    arrtotal.push({ text: 'Total', alignment: 'right', bold: true, colSpan: 3 })
    arrtotal.push('')
    arrtotal.push('')

    arrtotal.push({ text: Number(printObj['uptodatetotal'].toFixed(2)), alignment: 'right' })
    arrtotal.push({ text: Number(printObj['lastpaidtotal'].toFixed(2)), alignment: 'right' })
    arrtotal.push({ text: Number(printObj['topaytotal'].toFixed(2)), alignment: 'right' })
    dd.content[dd.content.length - 1].table.body.push(arrtotal);
   
    this.spinner.hide();

    pdfMake.createPdf(dd).download('running-bill' + '.pdf');
  }



  async getBoqItems(b_acct_id, tender_id) {
    var obj = { b_acct_id: b_acct_id, tender_id: tender_id }
    var resp = await this.tenderService.getItem(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.boqItems = resp['data'];
      this.boqObj = {};
      this.overunderobj = {};
      for (var i = 0; i < this.boqItems.length; i++) {
        this.boqObj[this.boqItems[i]['sno']] = this.boqItems[i];
        this.overunderobj[this.boqItems[i]['sno']] = { over_under_per: this.boqItems[i]['over_under_per'], over_under: this.boqItems[i]['over_under'] }
      }
    } else {
      Swal.fire("Oops", "Error while getting Boq Items");
    }
  }




  //get data Of Privious Bill running bill;
  async getPreviousBillItems(id, b_acct_id, bill_no, tender_id) {
    var obj = {
      b_acct_id: b_acct_id,
      bill_no: bill_no,
      tender_id: tender_id,
      id: id
    };
    var resp = await this.ebillService.getLastBill(JSON.stringify(obj));
    if (resp['error'] == false) {
      var dt = resp['data'];
      var prev_bill_no = bill_no - 1
      await this.getlastbillrate(b_acct_id, tender_id, prev_bill_no);
      await this.getpreviousbillquantity(b_acct_id, tender_id)
      console.log(dt)
      for (let i = 0; i < this.runningBill.length; i++) {
        this.alreadypaid[this.runningBill[i]['sno']] = this.runningBill[i]['already_measured']
      }
      var partarr = []
      for (var i = 0; i < dt.length; i++) {
        for (var j = 0; j < this.runningBill.length; j++) {
          if (this.runningBill[j]['currbillamt'] == undefined) {
            this.runningBill[j]['currbillamt'] = 0
            this.runningBill[j]['prevbillamt'] = 0
            this.runningBill[j]['uptodatebillamt'] = 0
          }
          if (dt[i]['sno'] == this.runningBill[j]['sno']) {
            if (dt[i]['bill_no'] < bill_no) {
              this.runningBill[j]['prevbillamt'] += dt[i]['quantity'] * this.prevbillpartrate[dt[i]['sno']];
              if (dt[i]['is_part'] == 2) {
                this.runningBill[j]['already_measured'] -= dt[i]['quantity'];
              } else {
                if (dt[i]['part_rate_id'] == -1) {
                  this.runningBill[j]['billPrev'] += dt[i]['quantity'];
                }

              }

            } else {
              this.runningBill[j]['currbillrate'] = Number(dt[i]['rate'])
              this.runningBill[j]['currbillamt'] += Number(dt[i]['quantity']) * Number(dt[i]['rate']);
              if (dt[i]['part_rate_id'] == -1) {
                this.runningBill[j]['billCurrent'] += dt[i]['quantity'];

              }
            }
            this.runningBill[j]['uptodatebillamt'] += dt[i]['quantity'] * dt[i]['rate'];
            this.runningBill[j]['billRate'] = dt[i]['rate'];
          }

        }
      }
      for (let i = 0; i < this.runningBill.length; i++) {
        if(this.prevbillpartrate[this.runningBill[i]['sno']] == undefined){
          this.prevbillpartrate[this.runningBill[i]['sno']] = 0
        }
        if(this.prevbillpartrate[this.runningBill[i]['sno']] == undefined){
          this.prevbillpartrate[this.runningBill[i]['sno']] = 0
        }


        if (this.runningBill[i]['eff_rate'] > this.runningBill[i]['currbillrate']) {
          this.runningBill[i]['eff_rate'] = this.runningBill[i]['currbillrate'] + '/' + this.runningBill[i]['eff_rate']
        }
        if (this.prevbillpartrate[this.runningBill[i]['sno']] != this.runningBill[i]['currbillrate'] && Number((this.runningBill[i]['already_measured'] + this.runningBill[i]['billPrev']).toFixed(2)) != 0) {
          this.runningBill[i]['eff_rate'] = this.runningBill[i]['eff_rate'] + ' ( Prev Rate is ' + this.prevbillpartrate[this.runningBill[i]['sno']] + ' )'
        }
        if(this.runningBill[i]['currbillrate'] == undefined) this.runningBill[i]['currbillrate'] = 0

        this.runningBill[i]['prevbillamt'] = Number((this.runningBill[i]['already_measured'] + this.runningBill[i]['billPrev']).toFixed(3)) * this.prevbillpartrate[this.runningBill[i]['sno']]
        this.runningBill[i]['uptodatebillamt'] = Number((this.runningBill[i]['already_measured'] + this.runningBill[i]['billPrev'] + this.runningBill[i]['billCurrent']).toFixed(3)) * this.runningBill[i]['currbillrate'];
        this.runningBill[i]['currbillamt'] = this.runningBill[i]['uptodatebillamt'] - this.runningBill[i]['prevbillamt']

      }
    } else {
      Swal.fire("Error", "Error while deleting bill", "error");
    }
  }
 //get data Of Privious Bill running bill;
 async getPreviousBillItemsabstractofcost(id, b_acct_id, bill_no, tender_id,selectedTenderInfo) {
  var obj = {
    b_acct_id: b_acct_id,
    bill_no: bill_no,
    tender_id: tender_id,
    
  };
  await this.getBoqItems(b_acct_id, tender_id)
  let ebill = await this.ebillService.getBill(JSON.stringify(obj));
  console.log(ebill)
 if(ebill['data'].length != 0) obj['bill_no'] = ebill['data'][ebill['data'].length-1]['bill_no']
 else  obj['bill_no'] = 0
  console.log(ebill['data'][ebill['data'].length-1])
  bill_no = obj['bill_no']
  let emb = await this.ebillService.getgenemb(JSON.stringify(obj))
  let embdata = emb['data']
  let snotoq = {}
  for (let i = 0; i < embdata.length; i++) {
    snotoq[embdata[i]['sno']] = embdata[i]['q']
    
  }
  var resp = await this.ebillService.getLastBill(JSON.stringify(obj));
  if (resp['error'] == false) {
    for (var i = 0; i < this.boqItems.length; i++) {
      this.runningBill[i] = Object.assign(this.boqItems[i])
      this.runningBill[i]['billRate'] = 0;
      this.runningBill[i]['billCurrent'] = 0;
      this.runningBill[i]['billPrev'] = 0;
    }
    var dt = resp['data'];
    var prev_bill_no = bill_no - 1
   
    await this.getlastbillrate(b_acct_id, tender_id, prev_bill_no);
    await this.getpreviousbillquantity(b_acct_id, tender_id)
    console.log(dt)
    bill_no = bill_no +2
    for (let i = 0; i < this.runningBill.length; i++) {
      this.alreadypaid[this.runningBill[i]['sno']] = this.runningBill[i]['already_measured']
    }
    var partarr = []
    for (var i = 0; i < dt.length; i++) {
      for (var j = 0; j < this.runningBill.length; j++) {
        if (this.runningBill[j]['currbillamt'] == undefined) {
          this.runningBill[j]['currbillamt'] = 0
          this.runningBill[j]['prevbillamt'] = 0
          this.runningBill[j]['uptodatebillamt'] = 0
        }
        if (dt[i]['sno'] == this.runningBill[j]['sno']) {
          if (dt[i]['bill_no'] < bill_no) {
            this.runningBill[j]['prevbillamt'] += dt[i]['quantity'] * this.prevbillpartrate[dt[i]['sno']];
            if (dt[i]['is_part'] == 2) {
              this.runningBill[j]['already_measured'] -= dt[i]['quantity'];
            } else {
              if (dt[i]['part_rate_id'] == -1) {
                this.runningBill[j]['billPrev'] += dt[i]['quantity'];
              }

            }

          } else {
            this.runningBill[j]['currbillrate'] = Number(dt[i]['rate'])
            this.runningBill[j]['currbillamt'] += Number(dt[i]['quantity']) * Number(dt[i]['rate']);
            if (dt[i]['part_rate_id'] == -1) {
              this.runningBill[j]['billCurrent'] += dt[i]['quantity'];

            }
          }
          this.runningBill[j]['uptodatebillamt'] += dt[i]['quantity'] * dt[i]['rate'];
          this.runningBill[j]['billRate'] = dt[i]['rate'];
        }

      }
    }
    for (let i = 0; i < this.runningBill.length; i++) {
      if(this.prevbillpartrate[this.runningBill[i]['sno']] == undefined){
        this.prevbillpartrate[this.runningBill[i]['sno']] = 0
      }
      if(this.prevbillpartrate[this.runningBill[i]['sno']] == undefined){
        this.prevbillpartrate[this.runningBill[i]['sno']] = 0
      }
if(snotoq[this.runningBill[i]['sno']] == undefined || snotoq[this.runningBill[i]['sno']] == null){
  snotoq[this.runningBill[i]['sno']] = 0
}
this.runningBill[i]['billCurrent'] =snotoq[this.runningBill[i]['sno']]
//this.runningBill[j]['billCurrent'] =snotoq[this.runningBill[i]['sno']]
     /*  if (this.runningBill[i]['eff_rate'] > this.runningBill[i]['currbillrate']) {
        this.runningBill[i]['eff_rate'] = this.runningBill[i]['currbillrate'] + '/' + this.runningBill[i]['eff_rate']
      } */
      /* if (this.prevbillpartrate[this.runningBill[i]['sno']] != this.runningBill[i]['currbillrate'] && Number((this.runningBill[i]['already_measured'] + this.runningBill[i]['billPrev']).toFixed(2)) != 0) {
        this.runningBill[i]['eff_rate'] = this.runningBill[i]['eff_rate'] + ' ( Prev Rate is ' + this.prevbillpartrate[this.runningBill[i]['sno']] + ' )'
      } */
      if(this.runningBill[i]['currbillrate'] == undefined) this.runningBill[i]['currbillrate'] = 0

      this.runningBill[i]['prevbillamt'] = Number((this.runningBill[i]['already_measured'] + this.runningBill[i]['billPrev']).toFixed(3)) * this.prevbillpartrate[this.runningBill[i]['sno']]
      this.runningBill[i]['uptodatebillamt'] = Number((this.runningBill[i]['already_measured'] + this.runningBill[i]['billPrev'] + this.runningBill[i]['billCurrent'] ).toFixed(3)) * this.runningBill[i]['eff_rate'];
      this.runningBill[i]['currbillamt'] = this.runningBill[i]['uptodatebillamt'] - this.runningBill[i]['prevbillamt']

    }
    this.print_abstractofcost({bill_no:bill_no}, selectedTenderInfo)
    console.log(this.runningBill)
  } else {
    Swal.fire("Error", "Error while deleting bill", "error");
  }
}



  //used in running-bill
  async getlastbillrate(b_acct_id, tender_id, prev_bill_no) {
    var obj = { b_acct_id: b_acct_id, tender_id: tender_id, bill_no: prev_bill_no }
    var resp = await this.ebillService.getlastbillrate(JSON.stringify(obj));
    console.log(this.boqItems)
    if (resp['error'] == false) {

      if (resp['data'].length > 0) {
        this.prevbillpartrate = new Object()
        for (let i = 0; i < resp['data'].length; i++) {
          this.prevbillpartrate[resp['data'][i]['sno']] = resp['data'][i]['rate']
        }
      } else {
        for (let i = 0; i < this.boqItems.length; i++) {
          this.prevbillpartrate[this.boqItems[i]['sno']] = this.boqItems[i]['part_rate']
          this.prevbillquantity[this.boqItems[i]['sno']] = 0
        }
      }
    } else {
      Swal.fire("Error", "Error while getting Previous Bill rate  data", "error");
    }
  }


  async getpreviousbillquantity(b_acct_id, tender_id) {
    var obj = { b_acct_id: b_acct_id, tender_id: tender_id }
    var resp = await this.ebillService.getquantityofprevbill(JSON.stringify(obj));
    console.log(resp)
    if (resp['error'] == false) {
      for (let i = 0; i < resp['data'].length; i++) {
        this.prevbillquantity[resp['data'][i]['sno']] = resp['data'][i]['quantity']
      }
    } else {
      Swal.fire("Error", "Error while getting Previous Bill Quantity  data", "error");
    }
  }


  async getAllWorkInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    var resp = await this.masterDataService.getWorkInfo(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.workObj = new Object()
      for (let i = 0; i < resp['data'].length; i++) {
        resp.data[i]['desc'] = resp.data[i]['work_order_no'] + " - " + resp.data[i]['work_order_name'];
        this.workObj[resp.data[i]['id']] = resp.data[i]
      }
    } else {
      Swal.fire("Oops", "Error while getting work info");
    }
  }


  async getAllparty(b_acct_id) {
    var resp = await this.masterDataService.getparty(b_acct_id);
    if (resp['error'] == false) {
      this.partyObj = new Object();
      let arr = []
      for (let i = 0; i < resp.data.length; i++) {
        this.partyObj[resp.data[i]['rep_le_id']] = resp.data[i]['party_leagal_name']
        arr[resp.data[i]['rep_le_id']] = resp.data[i]
      }
      return arr
    } else {
      Swal.fire("Error", "Error while getting Vendor Info", "error")
    }
  }
  async getAllpartyacc(b_acct_id) {
    var resp = await this.masterDataService.getparty(b_acct_id);
    if (resp['error'] == false) {
      this.partyObj = new Object();
      let arr = []
      for (let i = 0; i < resp.data.length; i++) {
       // this.partyObj[resp.data[i]['rep_le_id']] = resp.data[i]['party_leagal_name']
        arr[resp.data[i]['rep_le_id']] = resp.data[i]
      }
      return arr
    } else {
      Swal.fire("Error", "Error while getting Vendor Info", "error")
    }
  }

  async getDeductions(b_acct_id, id) {
    var ob = { b_acct_id: b_acct_id, bill_id: id }
    var resp = await this.ebillService.getALLDed(JSON.stringify(ob));
    if (resp['error'] == false) {
      this.allDed = resp['data'];
    } else {
      Swal.fire("Error", "Error while getting deductions", "error");
    }
  }
  async getDeductionsacc(b_acct_id, id) {
    var ob = { b_acct_id: b_acct_id, bill_id: id }
    var resp = await this.ebillService.getALLDed(JSON.stringify(ob));
    if (resp['error'] == false) {
      return resp['data'];
    } else {
      Swal.fire("Error", "Error while getting deductions", "error");
    }
  }
  async getAllDedacc(b_acct_id) {
    var resp = await this.ebillService.getmasterdeduction(JSON.stringify({b_acct_id:b_acct_id}));
    console.log(resp)
    if (resp['error'] == false) {
     
      this.dedTypeArr = resp.data;
      this.dedObj = new Object()
      let techobj = {}
      for (var i = 0; i < this.dedTypeArr.length; i++) {
        this.dedObj[this.dedTypeArr[i]['deduction_id']] = this.dedTypeArr[i];
        techobj[this.dedTypeArr[i]['ded_bus_name']] = this.dedTypeArr[i];
      }


      return {ded:this.dedObj,dedbusname:techobj,dedarr:this.dedTypeArr}
    } else {
      Swal.fire("Error", "Error while getting all deduction list", "error");
    }
  }
  async getAllDed(b_acct_id) {
    var resp = await this.ebillService.getded(b_acct_id);
    if (resp['error'] == false) {
      this.dedTypeArr = resp.data;
      this.dedObj = new Object()
      for (var i = 0; i < this.dedTypeArr.length; i++) {
        this.dedObj[this.dedTypeArr[i]['deduction_id']] = this.dedTypeArr[i];
      }
    } else {
      Swal.fire("Error", "Error while getting all deduction list", "error");
    }
  }
}
