import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { KanalolusturPage } from '../pages/kanalolustur/kanalolustur';
import { KanalPage } from '../pages/kanallistele/kanallistele';
import { TabsPage } from '../pages/tabs/tabs';
import { GetlerPage } from '../pages/getler/getler';
import { HowtousePage } from '../pages/howtouse/howtouse';
import { UyelikPage } from '../pages/uyelik/uyelik';
import { ElementolusturPage } from '../pages/elementolustur/elementolustur';
import { VerilerPage } from '../pages/veriler/veriler';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DbProvider } from '../providers/db/db';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';
import { TaskServiceProvider } from '../providers/task-service/task-service';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'Highcharts';
import Highmore from 'highcharts/highcharts-more.js';
import { Network } from '@ionic-native/network';


@NgModule({
  declarations: [
    MyApp,
    KanalolusturPage,
    KanalPage,
    TabsPage,
    GetlerPage,
    HowtousePage,
    UyelikPage,
    ElementolusturPage,
    VerilerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartModule.forRoot(highcharts,Highmore),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    KanalolusturPage,
    KanalPage,
    TabsPage,
    GetlerPage,
    HowtousePage,
    UyelikPage,
    ElementolusturPage,
    VerilerPage,
    
      
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DbProvider,
    DbProvider,
    SQLitePorter,
    SQLite,
    TaskServiceProvider,
    Network
  ]
})
export class AppModule {}
