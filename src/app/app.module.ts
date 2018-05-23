import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {BusyModule} from 'angular2-busy';
import { LoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';



import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GraphAreaComponent } from './main-page/graph-area/graph-area.component';
import { FooterComponent } from './main-page/footer/footer.component';
import { UserPanelComponent } from './main-page/user-panel/user-panel.component';
import { ServerConnectionService } from './server-connection/server-connection.service';
import { NodePageComponent } from './node-page/node-page.component';

const appRoutes: Routes = [
  { path: 'node/:cnp', component: NodePageComponent },
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
    FooterComponent,
    UserPanelComponent,
    NodePageComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule,
    MatGridListModule,
    MatButtonModule,
    MatTabsModule,
    NgxChartsModule,
    NgxGraphModule,
    BusyModule, 
    LoadingModule,
    HttpClientModule,
    MatInputModule   
  ],
  providers: [ServerConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
