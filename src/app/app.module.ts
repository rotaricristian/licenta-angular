import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BusyModule} from 'angular2-busy';
import {MatListModule} from '@angular/material/list';
import {Ng2Webstorage} from "ngx-webstorage";
import { LoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';

import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {GraphAreaComponent} from './main-page/graph-area/graph-area.component';
import {UserPanelComponent} from './main-page/user-panel/user-panel.component';
import {ServerConnectionService} from './server-connection/server-connection.service';
import {ConsumerPageComponent} from './node-page/consumer-page/consumer-page.component';
import {ProducerPageComponent} from './node-page/producer-page/producer-page.component';

const appRoutes: Routes = [
  {
    path: 'node/consumer/:cnp',
    component: ConsumerPageComponent
  },
  {
    path: 'node/producer/:cnp',
    component: ProducerPageComponent
  },
  {
    path: '',
    component: MainPageComponent

  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    GraphAreaComponent,
    UserPanelComponent,
    ConsumerPageComponent,
    ProducerPageComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatGridListModule,
    MatButtonModule,
    MatTabsModule,
    NgxChartsModule,
    NgxGraphModule,
    BusyModule,
    LoadingModule,
    HttpClientModule,
    MatInputModule,
    MatListModule,
    Ng2Webstorage
  ],
  providers: [ServerConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule {}
