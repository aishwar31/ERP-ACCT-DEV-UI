import { RouterModule, Routes } from '@angular/router';

import { AccCodeValueComponent } from './accounts/setting/acc-code-value/acc-code-value.component'
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
import { AccountsLayoutsComponent } from './accounts/accounts-layouts/accounts-layouts.component';
import { AccountsPartyComponent } from './accounts/setting/party/party.component'
import { AccountsRolesComponent } from './accounts/accounts-administration/Accounts-roles/Accounts-roles.component';
import { AccountsSettingComponent } from './accounts/setting/setting.component';
import { AccountsUsersComponent } from './accounts/accounts-administration/Accounts-users/Accounts-users.component';
import { ActivityHierComponent } from './accounts/ledger/activity-hier/activity-hier.component';
import { AdhocReportComponent } from './accounts/ledger/report/adhoc-report/adhoc-report.component';
import { AdviceComponent } from './accounts/advice/advice.component';
import { AllDedReportComponent } from './accounts/ledger/report/all-ded-report/all-ded-report.component';
import { ApprovalComponent } from './portal/approval/approval.component';
import { ArrListingComponent } from './accounts/ledger/report/arr-listing/arr-listing.component';
import { BankAccountComponent } from './accounts/tresuary/bank-account/bank-account.component';
import { BankReportComponent } from './accounts/ledger/report/bank-report/bank-report.component';
import { BillComponent } from './accounts/bill/bill.component';
import { BpComponent } from './accounts/bp/bp.component';
import { BudHierComponent } from './accounts/ledger/bud-hier/bud-hier.component';
import { ChallanComponent } from './accounts/challan/challan.component';
import { CharOfAccountComponent } from './accounts/ledger/char-of-account/char-of-account.component';
import { ChartOfAccMappingComponent } from './accounts/setting/chart-of-acc-mapping/chart-of-acc-mapping.component';
import { ContraComponent } from './accounts/tresuary/contra/contra.component';
import { CostCenterComponent } from './accounts/cost-center/cost-center.component';
import { DeductiionMappingComponent } from './accounts/setting/deductiion-mapping/deductiion-mapping.component';
import { DemandComponent } from './accounts/demand/demand.component';
import { DepartmentBillComponent } from './accounts/department-bill/department-bill.component';
import { DepartmentDemandsComponent } from './accounts/department-demands/department-demands.component';
import { DepartmentPaymentComponent } from './accounts/department-payment/department-payment.component';
import { EventGroupComponent } from './accounts/event-group/event-group.component';
import { EventLayoutsComponent } from './accounts/setting/event-layouts/event-layouts.component';
import { EventsComponent } from './accounts/ledger/events/events.component';
import { FinYearComponent } from './accounts/setting/fin-year/fin-year.component';
import { GatewayMIDConfigurationComponent } from './accounts/tresuary/gateway-mid-configuration/gateway-mid-configuration.component';
import { GstReportComponent } from './accounts/ledger/report/gst-report/gst-report.component';
import { IpComponent } from './accounts/setting/ip/ip.component'
import { JournalComponent } from './accounts/setting/journal/journal.component';
import { JournalReportComponent } from './accounts/ledger/report/journal-report/journal-report.component';
import { JrnlListingComponent } from './accounts/ledger/report/jrnl-listing/jrnl-listing.component';
import { JvComponent } from './accounts/ledger/jv/jv.component';
import { LeaveComponent } from './portal/leave/leave.component';
import { LedgerComponent } from './accounts/ledger/ledger.component';
import { LedgerReportComponent } from './accounts/ledger/report/ledger-report/ledger-report.component';
import { NgModule } from '@angular/core';
import { OrgHierComponent } from './accounts/ledger/org-hier/org-hier.component';
import { PartyReportComponent } from './accounts/ledger/report/party-report/party-report.component';
import { PortalDashComponent } from './portal/portal-dash/portal-dash.component';
import { PortalLayoutsComponent } from './portal/portal-layouts/portal-layouts.component'
import { PortalProductsComponent } from './portal/portal-products/portal-products.component';
import { PortalUserProfileComponent } from './portal/portal-user-profile/portal-user-profile.component';
import { PortalUsersComponent } from './portal/portal-users/portal-users.component';
import { ProdHierComponent } from './accounts/ledger/prod-hier/prod-hier.component';
import { ProductComponent } from './accounts/budget/product.component';
import { ProjHierComponent } from './accounts/ledger/proj-hier/proj-hier.component';
import { ProjectBankAccComponent } from './accounts/setting/project-bank-acc/project-bank-acc.component';
import { ReportComponent } from './accounts/ledger/report/report.component';
import { RoleGuardService } from './role-guard.service';
import { SalComponent } from './accounts/setting/sal/sal.component';
import { SalaryComponent } from './portal/salary/salary.component';
import { SavedReportComponent } from './accounts/ledger/report/saved-report/saved-report.component';
import { SecurityComponent } from '910-shared-ngx/dist/security';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { TaskComponent } from './portal/task/task.component';
import { TdsComponent } from './accounts/ledger/report/tds/tds.component';
import { TdsGstReportComponent } from './accounts/ledger/report/tds-gst-report/tds-gst-report.component';
import { TresuaryComponent } from './accounts/tresuary/tresuary.component';
import { TrialBalanceComponent } from './accounts/ledger/report/trial-balance/trial-balance.component';
import { WorkComponent } from './accounts/setting/work/work.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { "path": "",
        "component": PortalLayoutsComponent,
        "children": [
           
            {
                path: "index",
                component: PortalDashComponent,
                // canActivate: [RoleGuardService], data: { ComponentCode: 'EMB-R1' }
            },

            {
                path: "leave",
                component: LeaveComponent
            },
            {
                path: "yourproducts",
                component: PortalProductsComponent
            },
            {
                path: "task",
                component: TaskComponent
            },
            {
                path: "salary",
                component: SalaryComponent
            },
            {
                path: "users",
                component: PortalUsersComponent
            },
            {
                path: 'acc',
                component: AccountProfileComponent
            },

            {
                path: "profile",
                component: PortalUserProfileComponent,
            },

            {
                path: "appr",
                component: ApprovalComponent
            },
        ] },
    {
        "path": "accounts",
        "component": AccountsLayoutsComponent,
        "children": [
            {
                path: "index",
                component: AccountsDashComponent, canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R1' }
            },
            {
                path: "bill",
                component: BillComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R3' }

            },
            {
                path: "dep-bill",
                component: DepartmentBillComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R3' }

            },
            {
                path: "dep-payment",
                component: DepartmentPaymentComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R3' }

            },
            {
                path: "dep-demands",
                component: DepartmentDemandsComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R3' }

            },
            {
                path: "demand",
                component: DemandComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R4' }
            },
            {
                path: "budget",
                component: ProductComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R6' }
            },
            {
                path: "challan",
                component: ChallanComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R4' }
            },
            {
                path: "bank-payment",
                component: BpComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R3' }
            },
            {
                path: "advice",
                component: AdviceComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R3' }
            },
            {
                path: "cost-center",
                component: CostCenterComponent
            },
            {
                path: "ledger",
                component: LedgerComponent,
                children: [
                    
                    {
                        path: "jrnl",
                        component: AccJournalComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R6' }
                    },
                    {
                        path: "jv",
                        component: JvComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R6' }
                    },

                    {
                        path: "rule",
                        component: AccRuleComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "coa",
                        component: CharOfAccountComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "activity-hier",
                        component: ActivityHierComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "bud-hier",
                        component: BudHierComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "events",
                        component: EventsComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "prod-hier",
                        component: ProdHierComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "proj-hier",
                        component: ProjHierComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "org-hier",
                        component: OrgHierComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "report",
                        component: ReportComponent,
                        children: [
                            {
                                path: "trail-balance",
                                component: TrialBalanceComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "tds",
                                component: TdsComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "tds-gst",
                                component: TdsGstReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "ledger-report",
                                component: LedgerReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "adhoc-report",
                                component: AdhocReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "party-report",
                                component: PartyReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "arr-report",
                                component: ArrListingComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "jrnl-report",
                                component: JrnlListingComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "gst",
                                component: GstReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "bank-report",
                                component: BankReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },
                            {
                                path: "all-ded",
                                component: AllDedReportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R2' }
                            },


                        ]

                    },

                ]

            },
            {
                path: "event-group",
                component: EventGroupComponent,
            },
            {
                path: "tresuary",
                component: TresuaryComponent,
                children: [
                    {
                        path: "contra",
                        component: ContraComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R5' }
                    },
                    {
                        path: "bank-account",
                        component: BankAccountComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R5' }
                    },
                    {
                        path: "gateway-mid-configuration",
                        component: GatewayMIDConfigurationComponent
                    },
                ]

            },
            {
                path: "setting",
                component: AccountsSettingComponent,
                children: [
                    {
                        path: "party",
                        component: AccountsPartyComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R7' }
                    },
                    {
                        path: "work",
                        component: WorkComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R7'}
                    },
                    {
                        path: 'deduction-mapping',
                        component: DeductiionMappingComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}
                    },
                    {
                        path: "project-bank",
                        component: ProjectBankAccComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}

                    },
                    {
                        path: "acc-sal",
                        component: AccSalComponent
                    },
                    {
                        path: "acc-mapping",
                        component: ChartOfAccMappingComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}

                    },

                    {
                        path: "fields",
                        component: AccFieldsComponent
                    },
                    {
                        path: "code-value",
                        component: AccCodeValueComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}

                    },
                    {
                        path: "account-info",
                        component: AccountInfoComponent

                    },
                    
                  
                    {
                        path: "event-layout",
                        component: EventLayoutsComponent

                    },
                    {
                        path: "fin-year",
                        component: FinYearComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R6' }

                    },
                    {
                        path: "jrnl",
                        component: JournalComponent

                    },
                    {
                        path: "ip",
                        component: IpComponent

                    },
                    {
                        path: "sal",
                        component: SalComponent

                    },
                    {
                        path: "hsn",
                        component: AccGstComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R8'}

                    }
                ]

            },
            {

                "path": "administration",
                "component": AccountsAdministrationComponent,
                "children": [

                    {
                        path: "roles",
                        component: AccountsRolesComponent
                    },
                    {
                        path: "users",
                        component: AccountsUsersComponent
                    },
                    {
                        path: "dataAuth",
                        component: AccountsDataAuthComponent
                    },
                    {
                        path: "hierarchy",
                        component: AccountsHierarchyComponent
                    },
                    {
                        path: "data-assignment",
                        component: AccountsDataAssignmentComponent
                    },
                    {
                        path:"account-appr",
                        component:AccountDefApprovalComponent
                    }
                ]
            },{
                path: 'help', component: AccountHelpComponent,
                children: [
                    { path: 'doc', component: AccUserManualComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R9'} },
                    { path: 'faq', component: AccFaqComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R9'} },
                    { path: 'videos', component: AccTutorialComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R9'} },
                    { path: 'online-support', component: AccOnlineSupportComponent,canActivate: [RoleGuardService], data: { ComponentCode: 'ACCOUNT-R9'} },
                ]
            }
        ]
    },
    {
        "path": "login",
        // "component": SigninComponent
        "component": SecurityComponent
    },
    {
        "path": "register",
        "component": SignupComponent
    },
    {
        "path": "**",
        "redirectTo": "error_404",
        "pathMatch": "full"
    },
];

@NgModule({
    declarations: [

    ],
    imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
    exports: [
        RouterModule,
    ]
})

export class AppRoutingModule { }