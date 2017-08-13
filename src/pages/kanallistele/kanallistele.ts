import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { GetlerPage } from '../getler/getler';
import { HowtousePage } from '../howtouse/howtouse'
import { Http, Headers, RequestOptions } from '@angular/http';
import { UyelikPage } from '../uyelik/uyelik';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import { VerilerPage } from '../veriler/veriler';
import { ToastController, Toast  } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'kanallistele.html',
})
export class KanalPage {

  public kanallistelebtn: boolean = true;
  public kanallistelebtn2: boolean = false;
  public uyegirisdiv: boolean = false;
  public kanallardiv: boolean = false;
  getlerPage = GetlerPage;
  howtousePage = HowtousePage;
  uyelikPage  = UyelikPage;
  verilerPage  = VerilerPage;
  
  user = {};
  users = [];
  veriler = [];
  public datav:any; 

     toast: Toast = null;
  
  
constructor(public navCtrl: NavController,private databaseprovider: DbProvider,private toastCtrl: ToastController, public http: Http,private alertCtrl: AlertController) {
 /*this.platform.registerBackButtonAction(() => {
   
  });*/

}




 
  loadUserData() {
    this.databaseprovider.getAllUser().then(data => {
      this.users = data;
     if(data[0]['token'])
      {
         this.kanallistele();
      }
      
      if(data[0]['hata'])
          {
            let alert = this.alertCtrl.create({
         title: 'Giriş Hatası',
         subTitle: "Lütfen kullanıcı girişi yapınız",
         buttons: [ {
        text: 'Tamam',
        handler: () => {
          this.uyelik("3");
        }
      }]
        });
        alert.present();        
          }
     
    })
  }


getler(idkanal,apikey) {
  this.toast ? this.toast.dismiss() : false;
    this.navCtrl.push(GetlerPage, {
      kanalidpost: idkanal,
      kanalapikey: apikey,
      usertoken : this.users[0]['token'],
      userid : this.users[0]['user_id'],
      username : this.users[0]['username'],
      password : this.users[0]['password'],
    })
  }

  uyelik(islem) {
    this.toast ? this.toast.dismiss() : false;
    this.navCtrl.push(UyelikPage, {
      islem: islem,
    })
  }

   verilerigorpage(kanalid,kanalapi) {
     this.toast ? this.toast.dismiss() : false;
    this.navCtrl.push(VerilerPage, {
      kanalidpost:  kanalid,
      kanalapikey:  kanalapi,
       usertoken : this.users[0]['token'],
      userid : this.users[0]['user_id'],
      username : this.users[0]['username'],
      password : this.users[0]['password'],
    })
   }

uyekontrol()
{
  
   this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadUserData();
      }
    })
}


kanallistele()
{
 var veri;
    this.kanallardiv=true;    
    this.kanallistelebtn = false;
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    let postParams = {
      
    token: this.users[0]['token'],
    user_id: this.users[0]['user_id'],
    /*
    token: "93ba7c7d3a3-b92c635ff9c",
    user_id: "4",
    */
    }
    this.http.post("https://iothook.com/api/v1.0/channels/", postParams, options)
      .subscribe(data => {
        veri = data['_body'];
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
         this.veriler= [];
        for(var i = 0 ;;i++)
          {
           
              if(!veri.channel_list['channel_name_' + (i)])
                    break;   

            
              this.veriler.push({channelname: veri.channel_list['channel_name_' + (i)],channelid: veri.channel_list['channel_id_' + (i)],channelapikey: veri.channel_list['channel_api_key_'+(i)],show: true, id : i});              
              
            }

            let toastData = {
            message: 'Kanallar Listelendi',
            duration: 1000,
            position: 'bottom'
        }
        this.showToast(toastData);

       }, error => {
       let toastData = {
            message: 'İnternet bağlantınızda yada sunucuda sorun olabilir.',
            duration: 2000,
            position: 'bottom'
        }
        this.showToast(toastData);

    this.kanallardiv=false;    
    this.kanallistelebtn = true;
      });  
  }

   private showToast(data:any):void{
        this.toast ? this.toast.dismiss() : false;
        this.toast = this.toastCtrl.create(data);
        this.toast.present();
    }

  kanalsil(kanalid,deneme,id)
  {
  let alert = this.alertCtrl.create({
  title: 'Uyarı',
  subTitle: "Kanalı silmek istediğinize eminmisiniz?",
  buttons: [
      {
        text: 'İptal',
        handler: () => {
        }
      },
      {
        text: 'Sil',
        handler: () => {
                        var veri;
                        this.kanallardiv=true;
                        this.uyegirisdiv=false;
                        this.kanallistelebtn = false;
                        this.kanallistelebtn2 = false;
                        var headers = new Headers();
                        headers.append('Accept', 'application/json');
                        headers.append('Content-Type', 'application/json' );
                        //headers.append('Authorization' , 'Basic '+ btoa(tok));
                        let options = new RequestOptions({ headers: headers });
                        
                        let postParams = {
                        token: this.users[0]['token'],
                        user_id:this.users[0]['user_id'],
                        channel_id: kanalid,
                        api_key: deneme
                        }
                        this.http.post("https://iothook.com/api/v1.0/channel/delete/", postParams, options)
                          .subscribe(data => {
                            veri = data['_body'];
                            veri= veri.slice(1, -1);
                            veri = veri.replace(/\\/g, "");
                            veri = JSON.parse(veri);
                            this.veriler[id].show=false;
                           
                         
                          }, error => {
                          let toastData = {
                          message: 'İnternet bağlantınızda yada sunucuda sorun olabilir.',
                          duration: 2000,
                          position: 'bottom'
                      }
                      this.showToast(toastData);
                          });  
                            }
                          }
                        ]
                      });
                      alert.present();
  }
 
}