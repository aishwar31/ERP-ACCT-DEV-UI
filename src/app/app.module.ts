// import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
// import { AuthServiceConfig, SocialLoginModule } from 'angular-6-social-login';

import {
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';

import { AccCodeValueComponent } from './accounts/setting/acc-code-value/acc-code-value.component';
import { AccFaqComponent } from './accounts/account-help/acc-faq/acc-faq.component';
import { AccFieldsComponent } from './accounts/setting/acc-fields/acc-fields.component';
import { AccGstComponent } from './accounts/setting/acc-gst/acc-gst.component';
import { AccJournalComponent } from './accounts/ledger/acc-journal/acc-journal.component';
import { AccOnlineSupportComponent } from './accounts/account-help/acc-online-support/acc-online-support.component';
import { AccRuleComponent } from './accounts/ledger/acc-rule/acc-rule.component';
import { AccSalComponent } from './accounts/setting/acc-sal/acc-sal.component';
import { AccTutorialComponent } from './accounts/account-help/acc-tutorial/acc-tutorial.component';
import { AccUserManualComponent } from './accounts/account-help/acc-user-manual/acc-user-manual.component';
import { AccountDefApprovalComponent } from './accounts/accounts-administration/account-def-approval/account-def-approval.component';
import { AccountHelpComponent } from './accounts/account-help/account-help.component';
import { AccountInfoComponent } from './accounts/setting/account-info/account-info.component';
import { AccountProfileComponent } from './portal/account-profile/account-profile.component';
import { AccountsAdministrationComponent } from './accounts/accounts-administration/Accounts-administration.component';
import { AccountsDashComponent } from './accounts/accounts-dash/accounts-dash.component';
import { AccountsDataAssignmentComponent } from './accounts/accounts-administration/Accounts-data-assignment/Accounts-data-assignment.component';
import { AccountsDataAuthComponent } from './accounts/accounts-administration/Accounts-data-auth/Accounts-data-auth.component';
import { AccountsHierarchyComponent } from './accounts/accounts-administration/Accounts-hierarchy/Accounts-hierarchy.component';
import { AccountsLayoutsModule } from './accounts/accounts-layouts/accounts-layouts.module';
import { AccountsPartyComponent } from './accounts/setting/party/party.component';
import { AccountsRolesComponent } from './accounts/accounts-administration/Accounts-roles/Accounts-roles.component';
import { AccountsSettingComponent } from './accounts/setting/setting.component';
import { AccountsUsersComponent } from './accounts/accounts-administration/Accounts-users/Accounts-users.component';
import { ActivityHierComponent } from './accounts/ledger/activity-hier/activity-hier.component';
import { AdhocReportComponent } from './accounts/ledger/report/adhoc-report/adhoc-report.component';
import { AdviceComponent } from './accounts/advice/advice.component';
import { AgmCoreModule } from '@agm/core';
import { AllDedReportComponent } from './accounts/ledger/report/all-ded-report/all-ded-report.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApprovalComponent } from './portal/approval/approval.component';
import { ArrListingComponent } from './accounts/ledger/report/arr-listing/arr-listing.component';
import { BankAccountComponent } from './accounts/tresuary/bank-account/bank-account.component';
import { BankReportComponent } from './accounts/ledger/report/bank-report/bank-report.component';
import { BillComponent } from './accounts/bill/bill.component';
import { BpComponent } from './accounts/bp/bp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BudHierComponent } from './accounts/ledger/bud-hier/bud-hier.component';
import { ChallanComponent } from './accounts/challan/challan.component';
import { CharOfAccountComponent } from './accounts/ledger/char-of-account/char-of-account.component';
import { ChartOfAccMappingComponent } from './accounts/setting/chart-of-acc-mapping/chart-of-acc-mapping.component';
import { ChartsModule } from 'ng2-charts';
import { ContraComponent } from './accounts/tresuary/contra/contra.component';
import { CostCenterComponent } from './accounts/cost-center/cost-center.component';
import { DatePipe } from '@angular/common';
import { DeductiionMappingComponent } from './accounts/setting/deductiion-mapping/deductiion-mapping.component';
import { DemandComponent } from './accounts/demand/demand.component';
import { DepartmentBillComponent } from './accounts/department-bill/department-bill.component';
import { DepartmentDemandsComponent } from './accounts/department-demands/department-demands.component';
import { DepartmentPaymentComponent } from './accounts/department-payment/department-payment.component';
import { ENVIRONMENT } from '910-shared-ngx/dist/security';
import { EventGroupComponent } from './accounts/event-group/event-group.component';
import { EventLayoutsComponent } from './accounts/setting/event-layouts/event-layouts.component';
import { EventsComponent } from './accounts/ledger/events/events.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FinYearComponent } from './accounts/setting/fin-year/fin-year.component';
import{FlexModule} from '@angular/flex-layout'
import { FormsModule } from '@angular/forms';
import { GatewayMIDConfigurationComponent } from './accounts/tresuary/gateway-mid-configuration/gateway-mid-configuration.component';
import { GstReportComponent } from './accounts/ledger/report/gst-report/gst-report.component';
import { HttpClientModule } from '@angular/common/http';
import { IpComponent } from './accounts/setting/ip/ip.component'
import { JournalComponent } from './accounts/setting/journal/journal.component'
import { JournalReportComponent } from './accounts/ledger/report/journal-report/journal-report.component';
import { JrnlListingComponent } from './accounts/ledger/report/jrnl-listing/jrnl-listing.component';
import { JvComponent } from './accounts/ledger/jv/jv.component';
import { LeaveComponent } from './portal/leave/leave.component';
import { LedgerComponent } from './accounts/ledger/ledger.component';
import { LedgerReportComponent } from './accounts/ledger/report/ledger-report/ledger-report.component';
import {MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgApexchartsModule } from "ng-apexcharts";
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgtreegridModule } from 'ngtreegrid';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { OrgHierComponent } from './accounts/ledger/org-hier/org-hier.component';
import { PartyReportComponent } from './accounts/ledger/report/party-report/party-report.component';
import { PortalDashComponent } from './portal/portal-dash/portal-dash.component';
import { PortalLayoutsModule } from './portal/portal-layouts/protal-layouts.module';
import { PortalProductsComponent } from './portal/portal-products/portal-products.component';
import { PortalUserProfileComponent } from './portal/portal-user-profile/portal-user-profile.component';
import { PortalUsersComponent } from './portal/portal-users/portal-users.component';
import { ProdHierComponent } from './accounts/ledger/prod-hier/prod-hier.component';
import { ProductComponent } from './accounts/budget/product.component';
import { ProjHierComponent } from './accounts/ledger/proj-hier/proj-hier.component';
import { ProjectBankAccComponent } from './accounts/setting/project-bank-acc/project-bank-acc.component';
import { ReportComponent } from './accounts/ledger/report/report.component';
import { SalComponent } from './accounts/setting/sal/sal.component';
import { SalaryComponent } from './portal/salary/salary.component';
import { SavedReportComponent } from './accounts/ledger/report/saved-report/saved-report.component';
import { ScriptLoaderService } from './_services/script-loader.service';
import { SecurityModule } from '910-shared-ngx/dist/security';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { TaskComponent } from './portal/task/task.component';
import { TdsComponent } from './accounts/ledger/report/tds/tds.component';
import { TdsGstReportComponent } from './accounts/ledger/report/tds-gst-report/tds-gst-report.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { TresuaryComponent } from './accounts/tresuary/tresuary.component';
import { TrialBalanceComponent } from './accounts/ledger/report/trial-balance/trial-balance.component';
import { WorkComponent } from './accounts/setting/work/work.component';
import { environment } from '../environments/environment';

// import { PaymentComponent } from './property/property-party/payment/payment.component';
// import { PropcodevalueComponent } from './property/property-setting/propcodevalue/propcodevalue.component';
// import { ProptermComponent } from './property/property-setting/propterm/propterm.component';
// import { ProphierarchyComponent } from './property/property-setting/prophierarchy/prophierarchy.component';





//Portal Imports









// HRMS Imporrts




























































//Property Imports




































//accounts Import
























































//Engineering Imports





























//EMB Imports







































//Admin Module 














//MD











//social media login



































// import { NgApexchartsModule } from 'ng-apexcharts';






































































// export function socialConfigs() {
//   const config = new AuthServiceConfig(
//     [
//       {
//         id: FacebookLoginProvider.PROVIDER_ID,
//         provider: new FacebookLoginProvider('310166580213096')
//       },
//       {
//         id: GoogleLoginProvider.PROVIDER_ID,
//        // provider: new GoogleLoginProvider('871836852298-1p3fsnis2pscv456fk9894ci62i68ocq.apps.googleusercontent.com')
//        //provider: new GoogleLoginProvider('1014882691401-kvl5ivlpugmghqucvd55lf10i2rslf9s.apps.googleusercontent.com')
//        provider: new GoogleLoginProvider('900056498660-3eh1msvtfh2jvifipqpuiknfdc78lpvk.apps.googleusercontent.com')
//       }
//     ]
//   );
//   return config;
// }



@NgModule({
  declarations: [
  
    CostCenterComponent,
    AccountDefApprovalComponent,
    DepartmentBillComponent,
    DepartmentPaymentComponent,

    EventGroupComponent,
    TdsGstReportComponent,
    DeductiionMappingComponent,
    LedgerReportComponent,
    ChartOfAccMappingComponent,
    GstReportComponent,
    GatewayMIDConfigurationComponent,

    AllDedReportComponent,
    BankReportComponent,
    ProjectBankAccComponent,
    JvComponent,
    ArrListingComponent,
    JrnlListingComponent,
    EventsComponent,
    SalComponent,
    AccGstComponent,
    AccSalComponent,
    IpComponent,
    TdsComponent,
    JournalComponent,
    EventLayoutsComponent,
    TrialBalanceComponent,
    FinYearComponent,
    AccountInfoComponent,
    AccountInfoComponent,
    LedgerComponent,
    AccRuleComponent,
    ReportComponent,
    SavedReportComponent,
    AdhocReportComponent,
    CharOfAccountComponent,
    AccJournalComponent,
    AccountsPartyComponent,
    AccountsSettingComponent,
    AppComponent,
    SigninComponent,
    SignupComponent,
    PortalDashComponent,
    LeaveComponent,
    PortalUserProfileComponent,
    PortalUsersComponent,
    PortalProductsComponent,
    AccountsDashComponent,
    AdviceComponent,
    WorkComponent,
    
    AccountProfileComponent,
    
    BillComponent,
    BankAccountComponent,
    ProductComponent,
    AccFieldsComponent,
    AccCodeValueComponent,
    
    BpComponent,
    ChallanComponent,
    
    PartyReportComponent,
    SalaryComponent,
    TaskComponent,
    ApprovalComponent,
    JournalReportComponent,
    ProdHierComponent,
    ProjHierComponent,
    BudHierComponent,
    ActivityHierComponent,
    TresuaryComponent,
    ContraComponent,
    DemandComponent,
    
    AccountHelpComponent,
    AccFaqComponent,
    AccUserManualComponent,
    AccTutorialComponent,
    AccOnlineSupportComponent,
    AccountsDataAuthComponent,
    AccountsAdministrationComponent,
    AccountsRolesComponent,
    AccountsUsersComponent,
    AccountsHierarchyComponent,
    AccountsDataAssignmentComponent,

    OrgHierComponent,
    
    DepartmentDemandsComponent,
   

    // PaymentComponent,
    // PropcodevalueComponent,
    // ProptermComponent,
    // ProphierarchyComponent,




  ],
  imports: [  Ng2SearchPipeModule,
    NgxPaginationModule,
    AccountsLayoutsModule,
    BrowserModule,
    FlexModule,
 
    AppRoutingModule,
    PortalLayoutsModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'
    }),
    NgSelectModule,
    ChartsModule,
    FileUploadModule,
    MatInputModule,
    MatChipsModule,
    
    NgbModule,
    MatSlideToggleModule,
    FormsModule,
    NgtreegridModule,
    MatStepperModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    NgxSpinnerModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    SecurityModule
  ],
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    ScriptLoaderService,
    // AuthService,
    DatePipe,
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: socialConfigs
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }