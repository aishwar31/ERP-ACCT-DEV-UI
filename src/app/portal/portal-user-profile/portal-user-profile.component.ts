
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { ProfileService } from '../service/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainService as SA_mainService } from '../../services/admin/service/main.service';
import { MainService as MD_mainService } from '../../services/md/service/main.service';
import { MainService as portalMainService } from '../service/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
declare var $: any;
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllEmpService } from '../../services/hrms/service/all-emp.service';

 
@Component({
  selector: 'app-portal-user-profile',
  templateUrl: './portal-user-profile.component.html',
  styleUrls: ['./portal-user-profile.component.css']
})
export class PortalUserProfileComponent implements OnInit {

  constructor(private MD_mainService: MD_mainService, private sanitizer: DomSanitizer, private allEmpService: AllEmpService, private spinner: NgxSpinnerService, private SA_mainService: SA_mainService, private router: Router, public mainService: portalMainService, private _script: ScriptLoaderService, private profileService: ProfileService, private snackBar: MatSnackBar) { }
  empObj = { emp_id: '', emp_name: '', email: '', contact_no: '', addr_line_1: '', addr_line_2: '', designation: '' };
  pass = {}
  erpUser;
  imgURL;
  updateObj = {};
  selectedFile: File = null;
  isUpload;
  state_arr = [];
  public imagePath;
  httpUrl;
  uploader;
  estabInfo = [];
  b_acct_id;
  personalInfoObj = {};
  designation = "UNKNOWN";
  selectFileType = null
  userInfoObj = {}
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser['b_acct_id']
    this.httpUrl = this.profileService.httpUrl;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'pimage' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.imgURL = this.mainService.profileImageUrl;
    await this.getCurrentLegalEntity();
    await this.getcurrentroleswithresources();
  }


  roles;
  roleObj = {};
  async getcurrentroleswithresources() {
    this.spinner.show()
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id
    console.log(obj)
    var resp = await this.MD_mainService.getcurrentroleswithresources(JSON.stringify(obj));
    console.log(resp);
    if (resp['error'] == false) {
      this.roles = null;

      for (let i = 0; i < resp.data.length; i++) {
        this.roleObj[resp.data[i]['role_cd']] = resp.data[i]['role_name']
      }
      var role_cd = this.erpUser['role_cd'];

      for (let i = 0; i < role_cd.length; i++) {
        if (i == 0) {
          this.roles = this.roleObj[role_cd[i]]
        } else {
          this.roles = this.roles + " , " + this.roleObj[role_cd[i]]
        }
      }
      this.spinner.hide()
    } else {
      this.spinner.hide()
      Swal.fire("Error", "..Error while getting  roles", 'error');
    }
  }

  async getCurrentLegalEntity() {
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id
    obj['contact_email'] = this.erpUser['contact_email']
    obj['phone_no'] = this.erpUser['phone_no']
    var resp = await this.SA_mainService.getCurrentLegalEntity(JSON.stringify(obj));
    console.log(resp, 'current legal entity');
    if (resp['error'] == false) {
      console.log(resp);
      this.userInfoObj = Object.assign({}, resp['data'][0]);
      this.userInfoObj['party_dob'] = this.userInfoObj['party_dob'].split('T')[0]
      this.getEmpID(this.userInfoObj['le_id'])
    } else {
      Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE24'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE25'], 'error');
    }
  }

  back() {
    this.router.navigate(['/index'])
  }

  getNumberFormat(num) {
    if (num != undefined) {
      return num.toString().padStart(3, "0")
    } else {
      return num
    }
  }

  dateformatchange(date) {
    if (date == undefined || date == null || date == '') {
      return 'DD/MM/YYYY';
    }
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-")
    return datearr[2] + '/' + datearr[1] + '/' + datearr[0]
  }

  async getEmpID(le_id) {
    this.spinner.show()
    let obj = {}
    obj['b_acct_id'] = this.b_acct_id
    obj['le_id'] = le_id;
    console.log(obj)
    const res = await this.profileService.getEmpID(JSON.stringify(obj));
    console.log(res)
    if (res['error'] == false) {
      this.spinner.hide()
      if (res['data'].length > 0) {
        this.userInfoObj['emp_id'] = res['data'][0]['emp_id']
        this.userInfoObj['user_id'] = this.userInfoObj['le_id']
        this.updateObj=Object.assign({},this.userInfoObj)
      } else {
        Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE24'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE33'], 'error');
      }
    }
    else {
      this.spinner.hide()
      Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE24'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE26'], 'error');
    }
  }

  async updatePassword() {
    console.log(this.pass);
    if (this.pass['ident_verify_secret'] == this.pass['c_ident_verify_secret']) {
      this.pass['user_id'] = this.erpUser.le_id;
      console.log(this.pass)
      this.spinner.show()
      var resp = await this.profileService.changeUserPassword(this.pass);
      console.log(resp);
      if (resp['error'] == false) {
        this.spinner.hide()
        this.snackBar.open(resp['data'], 'Success', {
          duration: 5000,
        });
      } else {
        this.spinner.hide()

        this.snackBar.open(resp['data'], 'Error', {
          duration: 5000,
        });
      }
    } else {
      this.snackBar.open(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE28'], 'Error', {
        duration: 5000,
      });
    }
  }

  async updateEmpInfo() {
    this.spinner.show();
    this.updateObj['b_acct_id']=this.b_acct_id;
  
    var resp = await this.profileService.UpdateuserProfileDetails(this.updateObj);
    console.log(resp, 'resp');
    if (resp['error'] == false) {
      setTimeout(() => {
        this.spinner.hide()
        this.snackBar.open(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE30'], 'Success', {
          duration: 500,
        });
        var erpUser1=this.erpUser;
        erpUser1['party_name']=this.updateObj['party_name']
        localStorage.setItem('erpUser', JSON.stringify(erpUser1));

        this.getCurrentLegalEntity()
      }, 1000);
      this.spinner.hide()
    } else {
      this.spinner.hide()
      this.snackBar.open(resp.data, 'Error', {
        duration: 5000,
      });
    }
    
  }
  
  async Upload() {
    this.spinner.show()
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    const obj = new Object();
    obj['user_id'] = this.erpUser.user_id;
    obj['file_name'] = this.uploader.queue[0].some.name;
    const params = JSON.stringify(obj);
    this.uploader.queue[0].url = this.httpUrl + '/uploadimage' + params;
    this.uploader.queue[0].upload();
    this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
      if (!response.error) {
        const res = await this.profileService.getImage(this.erpUser.user_id);

        if (res) {
          this.spinner.hide()
          const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
          this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          this.mainService.profileImageUrl = this.imgURL;
        }
        this.spinner.hide()
        console.log("Image Uploaded!!!")
        Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE30'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE32'], 'success');

        // Swal.fire('Success..', 'Uploaded Successfully', 'success')

      } else {
        this.spinner.hide()
        Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE24'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE26'], 'error');
        //Swal.fire('Error...', 'Some Error Occured', 'error')

      }
    };
  }

  onFileUpload(event, files) {
    this.selectedFile = <File>event.target.files[0];

    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };

  }

  ngAfterViewInit() {
    this._script.load('./assets/js/scripts/profile-demo.js');
  }







  //*****************************************Unused Code****************************************************** */

  // async getEmpDetails() {
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   obj['emp_id'] = this.empIDObj['emp_id'];
  //   this.spinner.show();
  //   var resp = await this.allEmpService.getPersonalInfo(obj);
  //   if (resp['error'] == false) {
  //     console.log(resp, 'emp details')
  //     this.updateObj = resp['data'][0]
  //     this.spinner.hide()
  //     this.updateObj['contact_email'] = resp['data'][0]['emp_email']
  //     this.updateObj['phone_no'] = resp['data'][0]['emp_phone_no']
  //     this.updateObj['party_name'] = resp['data'][0]['emp_name']
  //   } else {
  //     this.spinner.hide()
  //     this.snackBar.open(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE27'], 'Error', {
  //       duration: 5000
  //     });
  //   }
  // }


  // async getEstablishmentInfo() {
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.erpUser.b_acct_id;
  //   obj['email'] = this.updateObj['contact_email'];
  //   obj['phone_no'] = this.updateObj['phone_no'];
  //   console.log(obj, 'establishment info')
  //   var resp = await this.profileService.getEstablishmentInfo(JSON.stringify(obj));
  //   console.log(resp);
  //   if (resp['error'] == false) {
  //     if (resp['data'].length > 0) {
  //       this.personalInfoObj = resp['data'][0];
  //       this.personalInfoObj['emp_dob'] = this.dateformatchange(this.personalInfoObj['emp_dob']);
  //       this.personalInfoObj['joining_date'] = this.dateformatchange(this.personalInfoObj['joining_date']);
  //       this.personalInfoObj['joining_service_date'] = this.dateformatchange(this.personalInfoObj['joining_service_date']);
  //     }
  //     console.log(this.personalInfoObj)
  //     this.estabInfo = resp['data'];
  //     console.log(this.estabInfo)
  //     if (this.estabInfo.length != 0) {
  //       this.designation = this.estabInfo[resp['data'].length - 1]['designation_code']
  //     }
  //   } else {

  //   }
  // }

  
  // allComponentCode = []
  // async getAllAssignedComponent(b_acct_id, role_cd) {
  //   var obj = new Object();
  //   obj['b_acct_id'] = b_acct_id;
  //   obj['role_cd'] = role_cd;
  //   console.log(obj)
  //   var resp = await this.mainService.getAllAssignedComponents(JSON.stringify(obj));
  //   console.log(resp)
  //   if (resp['error'] == false) {
  //     let dummy = []
  //     for (let i = 0; i < resp['data'].length; i++) {
  //       dummy.push(resp['data'][i]['resource_cd'])
  //     }
  //     this.allComponentCode = dummy
  //   } else {

  //   }

  // }
  // async getEmpInfo() {
  //   let obj = {}
  //   obj['b_acct_id'] = this.b_acct_id
  //   var resp = await this.profileService.getUserProfileInfo(JSON.stringify(obj));
  //   console.log(resp);
  //   if (resp['error'] == false) {
  //     this.empObj = resp['data'][0];
  //     this.updateObj = Object.assign({}, this.empObj);
  //   } else {
  //     this.snackBar.open(resp['data'], 'Error', {
  //       duration: 5000,
  //     });
  //   }
  // }
  // updateObj = {}



  // async finalupdatePersonalInfo() {
  //   this.personalInfoObj = Object.assign({}, this.updateObj)
  //   this.personalInfoObj['b_acct_id'] = this.b_acct_id;
  //   this.personalInfoObj['party_id'] = this.empIDObj['emp_id'];
  //   this.personalInfoObj['update_user_id'] = this.erpUser.user_id;
  //   this.personalInfoObj['emp_gst_no'] = '123'
  //   this.spinner.show();
  //   var resp = await this.allEmpService.updatePersonalInfo(this.personalInfoObj);
  //   console.log(resp, 'final update')
  //   if (resp['error'] == false) {
  //     this.spinner.hide();
  //     Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE30'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE31'], 'success');
  //     // Swal.fire("Success", "...Personal Info Updated!",'success');


  //   } else {
  //     this.spinner.hide();
  //     //Swal.fire("Error", "Some Error Occurred!",'error');
  //     Swal.fire(this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE24'], this.mainService.allLableShowObj[this.mainService.language_cd + 'PROFILE26'], 'error');


  //   }
  // }

  
  
  async print1() {
    console.log(this.estabInfo)
    var txt = this.mainService.accInfo['account_name'] + '(' + this.mainService.accInfo['account_short_name'] + ')'
    var dd = {
      pageSize: 'A3',
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
          text: 'Establishment Information',
          bold: true,
          alignment: 'center'
        }

      ],
    }

    var header1 = {
      columns: [
        {
          width: '*',
          text: 'Legal Name :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['emp_name']
        },
        {
          width: '*',
          text: 'Employee ID :',
          bold: true
        },

        {
          width: '*',
          text: 'VDA' + '' + this.getNumberFormat(this.personalInfoObj['emp_id'])
        }

      ],
    }
    var header2 = {
      columns: [
        {
          width: '*',
          text: 'Bank Account Number :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['acct_no']
        },
        {
          width: '*',
          text: 'Adhar Number  :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['emp_adhar_no']
        }

      ],
    }
    var header3 = {
      columns: [
        {
          width: '*',
          text: 'DOB :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['emp_dob']
        },
        {
          width: '*',
          text: 'Email :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['emp_email']
        }

      ],
    }
    var header4 = {
      columns: [

        {
          width: '*',
          text: 'Father/Husband Name :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['emp_father_name']
        },
        {
          width: '*',
          text: 'Identification Mark  :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['identification_mark']
        }

      ],
    }
    var header5 = {
      columns: [

        {
          width: '*',
          text: 'Joining Date :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['joining_date']
        },
        {
          width: '*',
          text: 'Joining Of Service Date :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['joining_service_date']
        }

      ],
    }
    var header6 = {
      columns: [

        {
          width: '*',
          text: 'Marital Status :',
          bold: true
        },

        {
          width: '*',
          text: this.personalInfoObj['marital_status']
        },
        {
          width: '*',
          text: "Pf Account Number ",
          bold: true
        },
        {
          width: '*',
          text: this.personalInfoObj['pf_status_no'],
          bold: true
        },

      ],
    }
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 761, y2: 0, lineWidth: 0.05 }] });
    dd.content.push({ text: " " });
    dd.content.push(header0);
    dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 761, y2: 0, lineWidth: 0.05 }] });
    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push({ text: " " });
    dd.content.push(header2);
    dd.content.push({ text: " " });
    dd.content.push(header3);
    dd.content.push({ text: " " });
    dd.content.push(header4);
    dd.content.push({ text: " " });
    dd.content.push(header5);
    dd.content.push({ text: " " });
    dd.content.push(header6);
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 761, y2: 0, lineWidth: 0.05 }] });
    var tbl = {

      // layout: 'lightHorizontalLines',
      fontSize: 10,
      table: {

        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*'],
        body: [
          ['S NO.', 'DESIGNATION', 'CLASS', { text: 'GRADE PAY', alignment: 'right' }, { text: 'PAY BAND', alignment: 'right' }, { text: 'LEVEL', alignment: 'right' }]
        ],
      }
    };
    dd.content.push(tbl);
    for (var i = 0; i < this.estabInfo.length; i++) {
      var arr = []
      arr.push(i + 1);
      arr.push(this.estabInfo[i]['designation_code']);
      arr.push(this.estabInfo[i]['class_code']);
      arr.push({ text: this.estabInfo[i]['grade_pay_code'], alignment: 'right' });
      arr.push({ text: this.estabInfo[i]['pay_scale_code'], alignment: 'right' });
      arr.push({ text: this.estabInfo[i]['level_code'], alignment: 'right' });

      dd.content[dd.content.length - 1].table.body.push(arr);
    }

    // this.spinner.hide()
    pdfMake.createPdf(dd).download("establishmentInfo");
  }
}

