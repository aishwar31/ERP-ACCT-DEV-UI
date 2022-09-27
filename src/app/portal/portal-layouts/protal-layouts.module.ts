import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { PortalLayoutsComponent } from './portal-layouts.component';

import { PortalFooterComponent } from './portal-footer/portal-footer.component';
import { PortalSidebarComponent } from './portal-sidebar/portal-sidebar.component';
import { PortalHeaderComponent } from './portal-header/portal-header.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
 

@NgModule({
	declarations: [
      PortalLayoutsComponent,
	  PortalHeaderComponent,
	  PortalFooterComponent,
	  PortalSidebarComponent,
	],
	exports: [
        PortalLayoutsComponent,
        PortalHeaderComponent,
        PortalFooterComponent,
        PortalSidebarComponent,
	],
	imports: [
		RouterModule,
		NgSelectModule,
                FormsModule
	]
})
export class PortalLayoutsModule {
}