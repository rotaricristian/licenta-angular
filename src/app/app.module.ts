import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatGridListModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GraphAreaComponent } from './main-page/graph-area/graph-area.component';
import { FooterComponent } from './main-page/footer/footer.component';
import { UserPanelComponent } from './main-page/user-panel/user-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    GraphAreaComponent,
    FooterComponent,
    UserPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatTabsModule,
    MatInputModule   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
