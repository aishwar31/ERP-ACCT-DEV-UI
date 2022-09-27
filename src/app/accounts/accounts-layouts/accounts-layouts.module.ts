import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { AccountsLayoutsComponent } from './accounts-layouts.component';

import { AccountsFooterComponent } from './accounts-footer/accounts-footer.component';
import { AccountsSidebarComponent } from './accounts-sidebar/accounts-sidebar.component';
import { AccountsHeaderComponent } from './accounts-header/accounts-header.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
        AccountsLayoutsComponent,
        AccountsHeaderComponent,
        AccountsFooterComponent,
        AccountsSidebarComponent,
	],
	exports: [
        AccountsLayoutsComponent,
        AccountsHeaderComponent,
        AccountsFooterComponent,
        AccountsSidebarComponent,
	],
	imports: [
		RouterModule,
                NgSelectModule,
                FormsModule
	]
})
export class AccountsLayoutsModule {
}