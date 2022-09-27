import { Component, OnInit, OnChanges, AfterViewInit, AfterViewChecked, AfterContentInit, Inject } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
// import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
declare var $: any;
import { MainService } from '../portal/service/main.service';
import { MainService as MainServiceADMIN } from '../services/admin/service/main.service';
import { HttpClient } from "@angular/common/http";

enum CheckBoxType { APPLY_FOR_JOB, MODIFY_A_JOB, NONE };
 
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, AfterContentInit {
  obj = { email: '', password: '', confirmPassword: '' }
  constructor(private http: HttpClient, public mainServiceADMIN: MainServiceADMIN, private mainService: MainService, public OAuth: SocialAuthService, private router: Router, private snackBar: MatSnackBar, private spinner: NgxSpinnerService, public auth: AuthenticationService) {
  }




  //login info add karne k liye Code
  lat: any;
  long: any;
  ipAddress;
  ipAddress2: any;
  browser;
  AllRoleZone = []
  data_auth_id;
  lng;
  zoom;
  login_obj = {
    user_id: null, login_time: null, login_ip: null, login_browser: null,
    latitude: null, longitude: null, active_from_time: null, logout_time: null,
    login_type: 'ONLOAD', status: 'NA', login_id: null, password: null, message: 'Just First view On Website...'
  }

  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
      this.login_obj['login_ip'] = this.ipAddress;
    });
  }
  geoLocation() {
    var pos;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.zoom = 16;
        this.login_obj['latitude'] = lat;
        this.login_obj['longitude'] = lng;
      });
    }
    else {
      alert('Browser Does`t Supported')
    }
  }

  public getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  async ngAfterContentInit() {

    setTimeout(async () => {
      await this.geoLocation();
    }, 500);
    setTimeout(async () => {
      await this.getIPAddress();
    }, 500)

    //browser set

    this.browser = await this.getBrowserName();
    this.login_obj['login_browser'] = this.browser;

    //active time set
    var current = new Date();
    var date = current.toLocaleString();
    this.login_obj['active_from_time'] = date;
    setTimeout(async () => {
      await this.insertLoginInfo(this.login_obj);
    }, 3000)
  }


  async insertLoginInfo(obj) {
    var resp = await this.auth.createloginInfo(obj);
  }



  //login info add karne k liye Code

  mobile_otp;
  otp_to_Match = 0;
  allowLogin: boolean = false;
  phone_no;
  your_password_flag = false;
  your_password;
  language_cd;


  async ngOnInit() {
    localStorage.removeItem('erpUser');
    this.language_cd = this.auth.language_cd;
  }

  otp_flag: boolean = false;
  erpUserData = {};

  SubmitForgetPassword() {
  }

  close() {
  }

  error_msg1;
  error_flag1;
  otp_no;
  otp_mobile_no;
  AllAccountData = [];
  mobile_number;



  async sendOtp() {
    var obj = new Object();
    obj['ident_to_verify'] = this.mobile_number;
    obj['ident_verify_method'] = 'OTP';
    var resp = await this.auth.loginERP(obj);
    if (resp['error'] == false) {
      if (resp['data'].length == 0) {
        Swal.fire("Oops", this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN17'], 'error');
        this.error_flag1 = true;
        return;
      } else {
        this.error_msg1 = "";
        this.error_flag1 = false;
      };

    } else {
      Swal.fire("Oops", this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN17'], 'error');
      this.error_flag1 = true;
      return;
    }

    this.otp_mobile_no = this.mobile_number;
    var resp = await this.auth.sendMsg(this.mobile_number);
    if (resp['Status'] == 'Success') {
      this.otp_flag = true;
      this.session_id = resp['Details']
      Swal.fire(this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN16'], this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN15'], 'success');
    }
  }
  session_id
  async LoginWithOtp() {
    if (this.mobile_number == this.otp_mobile_no) {
      this.login_obj['login_type'] = 'OTP';
      this.login_obj['login_id'] = this.otp_mobile_no;
      this.login_obj['password'] = null;
      if (await this.auth.verifyMsg(this.otp_no, this.session_id)) {
        var obj = new Object();
        obj['ident_to_verify'] = this.mobile_number;
        obj['ident_verify_method'] = 'OTP';
        var resp = await this.auth.loginERP(obj);
        if (resp['error'] == false && resp['data'].length > 0) {

          this.AllAccountData = resp['data'];

          for (let i = 0; i < this.AllAccountData.length; i++) {
            this.AllAccountData[i]['acct_desc'] = this.AllAccountData[i]['b_acct_id'] + " - " + this.AllAccountData[i]['account_name']
          }
          this.spinner.hide();
          if (resp['data'].length > 1) {
            await this.selectMultiAccount();
          } else {
            await this.selectOneAccount();
          }

        } else if (resp['data'].length == 0) {
          this.spinner.hide();
          this.login_obj['status'] = "FAIL";
          this.login_obj['user_id'] = null;
          this.login_obj['message'] = this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'];

          await this.insertLoginInfo(this.login_obj);
          Swal.fire("Oops", this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'], 'error');
        } else if (resp['error'] == true) {
          this.spinner.hide();
          this.login_obj['status'] = "FAIL";
          this.login_obj['user_id'] = null;
          this.login_obj['message'] = 'Login Failed due to api error true';

          await this.insertLoginInfo(this.login_obj);
          Swal.fire('Error...', 'Login Failed', 'error')
        }
      } else {
        this.spinner.hide();
        this.login_obj['status'] = "FAIL";
        this.login_obj['user_id'] = null;
        this.login_obj['message'] = 'OTP Not Match!';

        await this.insertLoginInfo(this.login_obj);

        Swal.fire('Error...', 'OTP Not Match!', 'error')
      }
    } else {
      this.spinner.hide();
      Swal.fire('Error...', 'Mobile Number Not Match!', 'error')
    }
  }


  //social media login
  public socialSignIn(socialProvider: string) {

    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.OAuth.signIn(socialPlatformProvider).then(async socialusers => {


      var obj = new Object();
      obj['ident_to_verify'] = socialusers['email'];
      obj['ident_verify_method'] = 'GOA';

      this.login_obj['login_id'] = socialusers['email'];
      this.login_obj['password'] = null;
      this.login_obj['login_type'] = 'GOA';

      this.spinner.show();;
      var resp = await this.auth.loginERP(obj);
      if (resp['error'] == false && resp['data'].length > 0) {
        this.AllAccountData = resp['data'];
        for (let i = 0; i < this.AllAccountData.length; i++) {
          this.AllAccountData[i]['acct_desc'] = this.AllAccountData[i]['b_acct_id'] + " - " + this.AllAccountData[i]['account_name']
        }
        this.spinner.hide();

        if (resp['data'].length > 1) {
          await this.selectMultiAccount();
        } else {
          await this.selectOneAccount();
        }

      } else if (resp['data'].length == 0) {
        this.spinner.hide();
        this.login_obj['status'] = "FAIL";
        this.login_obj['user_id'] = null;
        this.login_obj['message'] = this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'];
        await this.insertLoginInfo(this.login_obj);
        Swal.fire("Oops", this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'], 'error');
      }
      else {
        this.spinner.hide();
        this.login_obj['status'] = "FAIL";
        this.login_obj['user_id'] = null;
        this.login_obj['message'] = 'Login Failed';

        await this.insertLoginInfo(this.login_obj);
        Swal.fire("Oops", "Login Failed", 'error');
      }
    });
  };
  assigned_accounts = []
  async login() {

    if (this.currentlyChecked == 0 || this.currentlyChecked == 1) {
      var valid_mob = this.validatePhoneNumber(this.obj['email'])
      var valid_email = this.validateEmail(this.obj['email']);

      this.login_obj['login_type'] = 'PASSWORD';
      this.login_obj['login_id'] = this.obj['email'];
      this.login_obj['password'] = null;

      if (valid_mob == true && this.currentlyChecked == 0) {
        var obj = new Object();
        obj['ident_to_verify'] = this.obj['email'];
        obj['ident_verify_method'] = 'P-KEY';
        obj['ident_verify_secret'] = this.obj['password'];
        this.spinner.show();
        var resp = await this.auth.loginERP(obj);
        if (resp['error'] == false && resp['data'].length > 0) {
          this.AllAccountData = resp['data'];
          for (let i = 0; i < this.AllAccountData.length; i++) {
            this.AllAccountData[i]['acct_desc'] = this.AllAccountData[i]['b_acct_id'] + " - " + this.AllAccountData[i]['account_name']
            this.assigned_accounts.push(this.AllAccountData[i]['account_short_name'])
          }

          if (resp['data'].length > 1) {
            await this.selectMultiAccount();
          } else {
            await this.selectOneAccount();
          }

          this.spinner.hide()
        } else if (resp['data'].length == 0) {
          this.spinner.hide();
          this.login_obj['status'] = "FAIL";
          this.login_obj['user_id'] = null;
          this.login_obj['message'] = this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'];

          await this.insertLoginInfo(this.login_obj);
          Swal.fire("Oops", this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'], 'error');
        } else {
          this.spinner.hide();
          this.login_obj['status'] = "FAIL";
          this.login_obj['user_id'] = null;
          this.login_obj['message'] = 'This Email Or Mobile Is Not Registered';

          await this.insertLoginInfo(this.login_obj);
          Swal.fire('Error...', 'This Email Or Mobile Is Not Registered', 'error')
        }
      } else if (valid_email == true && this.currentlyChecked == 1) {
        this.spinner.show();
        var obj = new Object();
        obj['ident_to_verify'] = this.obj['email'];
        obj['ident_verify_method'] = 'E-KEY';
        obj['ident_verify_secret'] = this.obj['password'];

        var resp = await this.auth.loginERP(obj);
        if (resp['error'] == false && resp['data'].length > 0) {

          this.AllAccountData = resp['data'];
          for (let i = 0; i < this.AllAccountData.length; i++) {
            this.AllAccountData[i]['acct_desc'] = this.AllAccountData[i]['b_acct_id'] + " - " + this.AllAccountData[i]['account_name']
          }

          if (resp['data'].length > 1) {
            await this.selectMultiAccount();
          } else {
            await this.selectOneAccount();
          }

          this.spinner.hide();
        } else if (resp['data'].length == 0) {
          this.spinner.hide();
          this.login_obj['status'] = "FAIL";
          this.login_obj['user_id'] = null;
          this.login_obj['message'] = this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18']

          await this.insertLoginInfo(this.login_obj);
          Swal.fire("Oops", this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'], 'error');
        } else {
          this.spinner.hide();
          this.login_obj['status'] = "FAIL";
          this.login_obj['user_id'] = null;
          this.login_obj['message'] = this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18']

          await this.insertLoginInfo(this.login_obj);
          Swal.fire('Error...', this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN18'], 'error')
        }
      }
      else {
        Swal.fire('Error...', this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN20'], 'error')
      }

    } else {
      Swal.fire('Warning', ' Please Select An Option For Login', 'warning')
    }
  }


  check_box_type = CheckBoxType;
  currentlyChecked: CheckBoxType = 0;
  selectCheckBox(targetType: CheckBoxType) {
    // If the checkbox was already checked, clear the currentlyChecked variable
    if (this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.NONE;
      return;
    }

    this.currentlyChecked = targetType;

  }


  validatePhoneNumber(input_str) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(input_str);
  }
  validateEmail(input_str) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/im;
    return re.test(input_str);
  }


  login_with_otp = true;
  login_with_password = this.auth.login_with_password;
  login_with_google_oath = true;

  async selectOneAccount() {
    this.b_account_id = this.AllAccountData[0]['b_acct_id'];
    await this.submitAccount();
  }

  async selectMultiAccount() {
    $('#multi_account').modal('show');
  }

  b_account_id;
  async submitAccount() {
    $('#multi_account').modal('hide');

    if (this.b_account_id == undefined || this.b_account_id == null) {
      Swal.fire('Error...', 'Login Failed!', 'error')
      return;
    }

    for (let i = 0; i < this.AllAccountData.length; i++) {
      if (this.AllAccountData[i]['b_acct_id'] == this.b_account_id) {
        this.login = this.AllAccountData[i];
      }
    }
    this.login['assigned_product_cd'] = await this.getAccountModule(this.login['b_acct_id']);
    this.login['user_id'] = this.login['le_id'];
    await this.getUserRoleInfo(this.login);
  }

  allowLoginValidate() {
    this.allowLogin = false
  }

  forgetPassWord() {
    $('#forget').modal('show');
  }




  AllUserRole = [];
  assigned_User_Roles = [];
  assigned_user_modules = [];



  //get Account Related Module
  async getAccountModule(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    var resp = await this.auth.getaccountmodule(JSON.stringify(obj));
    if (resp['error'] == false) {
      console.log(resp['data'][0]['module_cd'])
      return resp['data'][0]['module_cd'].split(",");
    } else {
      this.snackBar.open(resp['data'], 'Error', {
        duration: 5000,
      });
    }
    return []
  }


  //Get User Related Role Data From data_auth
  async getUserRoleInfo(acct_info) {
    this.assigned_User_Roles = []
    var obj1 = new Object();
    obj1['user_id'] = acct_info.user_id;
    obj1['b_acct_id'] = acct_info.b_acct_id;
    var resp;
    if (acct_info.b_acct_id == 0) {
      resp = await this.auth.getCurrentUserFromAdmin(JSON.stringify(obj1));
    } else {
      resp = await this.auth.getCurrentUserFromMD(JSON.stringify(obj1));
    }
    if (resp['error'] == false) {
      this.AllUserRole = resp.data;
      for (let i = 0; i < this.AllUserRole.length; i++) {
        this.assigned_User_Roles.push(this.AllUserRole[i]['role_cd']);
      }
      await this.finalSubmit();
    } else {

    }
  }


  //get User Resource And User Module Data
  async getAllAssignedComponent(b_acct_id, role_cd) {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    obj['role_cd'] = role_cd;
    var resp
    if (b_acct_id == 0) {
      resp = await this.mainServiceADMIN.getresourcebyrolecd(JSON.stringify(obj));
    } else {
      resp = await this.mainService.getAllAssignedComponents(JSON.stringify(obj));
    }
    var allComponentCode = [];
    this.assigned_user_modules = [];
    if (resp['error'] == false) {
      this.spinner.hide()
      for (let i = 0; i < resp['data'].length; i++) {
        if (!this.assigned_user_modules.includes(resp['data'][i]['module_cd'])) {
          this.assigned_user_modules.push(resp['data'][i]['module_cd'])
        }
        allComponentCode.push(resp['data'][i]['resource_cd'])
      }
      this.login['module_cd'] = this.assigned_user_modules;
      return allComponentCode;
    } else {
      this.spinner.hide();
      Swal.fire('Error', 'Error While Getting All Resource', 'error')
      return allComponentCode;
    }
  }


  //Final Submit Function Of Sign In
  async finalSubmit() {
    $('#multi_role').modal('hide');
    this.login['role_cd'] = this.assigned_User_Roles;

    this.login['assigned_component'] = await this.getAllAssignedComponent(this.login['b_acct_id'], this.assigned_User_Roles);
    this.login['party_name'] = await this.getSetPartyName(this.login['b_acct_id'], this.login['contact_email'], this.login['phone_no'])

    localStorage.setItem('erpUser', JSON.stringify(this.login));

    this.login_obj['status'] = "PASS";
    this.login_obj['user_id'] = "User ID:" + this.login['le_id'] + " & In Account Id:" + this.login['b_acct_id'];
    this.login_obj['message'] = this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN19']
    await this.insertLoginInfo(this.login_obj);
    Swal.fire('Success...', this.auth.allLableShowObj[this.auth.language_cd + 'LOGIN19'], 'success');

    if (this.login['b_acct_id'] == 0) {
      this.router.navigate(["/solution-admin/index"])
    } else {
      this.router.navigate(['/index']);
    }
  }


  async getSetPartyName(b_acct_id, email, phone_no) {
    let obj = {}
    obj['b_acct_id'] = b_acct_id
    obj['contact_email'] = email
    obj['phone_no'] = phone_no
    var resp = await this.mainServiceADMIN.getCurrentLegalEntity(JSON.stringify(obj));
    if (resp['error'] == false) {
      return resp['data'][0]['party_name'];
    } else {
      return 'NA'
    }
  }

  submitRoleAndZone() {

  }


}
