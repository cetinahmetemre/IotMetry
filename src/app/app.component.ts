import { Component,ViewChild  } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { DbProvider } from '../providers/db/db';
import { NavController } from 'ionic-angular';
import { UyelikPage } from '../pages/uyelik/uyelik';
import { HowtousePage } from '../pages/howtouse/howtouse';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = TabsPage;
   @ViewChild('mycontent') nav: NavController;

  adsoyad;
  goster;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private databaseprovider: DbProvider,public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
     this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadUserData();
      }
    })
      statusBar.styleDefault();
      splashScreen.hide();


    });

    events.subscribe('user:login', () => {
   this.loadUserData();
});
  }

  cikis(islem,tur)
  {
     this.databaseprovider.deleteuser();
     this.nav.push(UyelikPage, {
      islem: islem,      
    })  
    
  }

   kullanim()
  {
     this.nav.push(HowtousePage);
  }
  

   loadUserData() {
    this.databaseprovider.getAllUser().then(data => {
     
      if(data[0]['ad']!=undefined)
        {
          this.goster=true;
           this.adsoyad = data[0]['ad'] +" "+ data[0]['soyad'];
        }
      else
        {
          this.goster=false;
        }
     
    })
    }
}
