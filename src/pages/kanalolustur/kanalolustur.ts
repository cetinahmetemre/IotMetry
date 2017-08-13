import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ElementolusturPage } from '../elementolustur/elementolustur';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DbProvider } from '../../providers/db/db';
import { UyelikPage } from '../uyelik/uyelik';
import { ToastController ,Toast } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'kanalolustur.html'
})
export class KanalolusturPage {

  elementpage = ElementolusturPage;
  kanal= {};
  users = [];
  toast: Toast = null;
  constructor(public navCtrl: NavController , private databaseprovider: DbProvider, private http : Http , private alertCtrl: AlertController,private toastCtrl: ToastController) {
      
  }

  loadUserData() {
    this.databaseprovider.getAllUser().then(data => {
      this.users = data;
     if(data[0]['token'])
      {
       this.kanalolustur();
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

uyelik(islem) {
    this.navCtrl.push(UyelikPage, {
      islem: islem,
    })
  }

  kanalolustur()
  {
    var veri;
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );  
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    let postParams = {
    //token: '381f13d7056-ce5fe474919',
    //user_id: "71",
    token : this.users[0]['token'],
    user_id : this.users[0]['user_id'],
    device: this.kanal['cihaz'],
    name: this.kanal['ad'],
    description: this.kanal['aciklama'],
    }
    
    this.http.post("https://iothook.com/api/v1.0/channel/create/", postParams, options)
      .subscribe(data => {
        veri = data['_body'];    
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
        console.log(veri);
        if(veri.msg_ok){
         let toastData = {
            message: veri.msg_ok,
            duration: 500,
            position: 'bottom'
        }
        this.showToast(toastData);    


      this.navCtrl.push(ElementolusturPage, {
      kanalidpost: veri.channel_id,
      kanalapikey:  veri.channel_token,
      usertoken: this.users[0]['token'],
      userid : this.users[0]['user_id'],
      username:this.users[0]['username'],
      password : this.users[0]['password']
    })
        }
         if(veri.msg_err){
           console.log("burada");
            let toastData = {
            message: veri.msg_err,
            duration: 2000,
            position: 'bottom'
        }
        this.showToast(toastData);    

        }

        }, error => {
       let toastData = {
            message: 'İnternet bağlantınızda yada sunucuda sorun olabilir.',
            duration: 2000,
            position: 'bottom'
        }
        this.showToast(toastData);    
        
      });

      
  }

  private showToast(data:any):void{
        this.toast ? this.toast.dismiss() : false;
        this.toast = this.toastCtrl.create(data);
        this.toast.present();
    }

}
