import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { ElementolusturPage } from '../elementolustur/elementolustur';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { KanalPage } from '../kanallistele/kanallistele';
import { VerilerPage } from '../veriler/veriler';
import { FabContainer } from 'ionic-angular';
import { ToastController , Toast} from 'ionic-angular';
/**
 * Generated class for the GetlerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-getler',
  templateUrl: 'getler.html',
})
export class GetlerPage {

  kanalpage = KanalPage;
  verilerPage  = VerilerPage;
  public kanalid;
  public veri:any;
  veriler = [];
  deneme:any;
  toast: Toast = null;

  constructor(private _sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController, public http: Http,private alertCtrl: AlertController, private storage:Storage) {
        this.kanalgetler();
  }

  ionViewDidLoad() {
  }

  elementolusturpage() {
    this.toast ? this.toast.dismiss() : false;
    this.navCtrl.push(ElementolusturPage, {
      kanalidpost:  this.navParams.get("kanalidpost"),
      kanalapikey:  this.navParams.get("kanalapikey"),
      usertoken: this.navParams.get("usertoken"),
      userid : this.navParams.get("userid"),
      username: this.navParams.get("username"),
      password : this.navParams.get("password")
    })
  }

   verilerigorpage() {
     this.toast ? this.toast.dismiss() : false;
    this.navCtrl.push(VerilerPage, {
      kanalidpost:  this.navParams.get("kanalidpost"),
      kanalapikey:  this.navParams.get("kanalapikey"),
      username: this.navParams.get("username"),
      password : this.navParams.get("password")
    })
  }


  kanalgetler()
  {
     var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );  
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    let postParams = {
    token: this.navParams.get("usertoken"),
    user_id: this.navParams.get("userid"),
    channel: this.navParams.get("kanalidpost")
    }
    
    this.http.post("https://iothook.com/api/v1.0/channel/elements/", postParams, options)
      .subscribe(data => {
        this.veri = data['_body']; 
         this.veri=  this.veri.slice(1, -1);
         this.veri = this.veri.replace(/\\/g, "");
         this.veri = JSON.parse( this.veri);
        if(!this.veri.msg_err)
          {
              for(var i = 0 ;;i++)
          {
              if(!this.veri.element_list['element_name_' + (i)])
                    break;   
                      this.gettype(i);
          }
                    
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

   gettype(i) {

     this.storage.get(this.navParams.get("kanalidpost")+"element_"+(i+1)).then(datas=>{
               this.veriler.push({elementname: this.veri.element_list['element_name_' + (i)],elementid:  this.veri.element_list['element_id_' + (i)], gorunum: datas , gorunumsec: this.navParams.get("kanalidpost")+"element_"+(i+1),show:true,id: i});  
       
              });    

   }
  
  getBackground (image) {
    return this._sanitizer.bypassSecurityTrustStyle('url(assets/img/'+image+'.png)');
}

  elementgorunum(id,gorunum,fab: FabContainer,degisid)
  {
    this.storage.set(id.id,gorunum);
      this.storage.get(id.id).then((val) => {
      fab.close();
      this.veriler[degisid].gorunum = gorunum;
    })
  }



    elementsil(elementid,id)
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
                        var headers = new Headers();
                        headers.append('Accept', 'application/json');
                        headers.append('Content-Type', 'application/json' );
                        //headers.append('Authorization' , 'Basic '+ btoa(tok));
                        let options = new RequestOptions({ headers: headers });
                        
                        let postParams = {
                        token: this.navParams.get("usertoken"),
                        user_id: this.navParams.get("userid"),
                        element_id: elementid,
                        api_key:this.navParams.get("kanalapikey")
                        }
                    
                        this.http.post("https://iothook.com/api/v1.0/element/delete/", postParams, options)
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

  kanaldetay()
  {
    var veri;
     var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );  
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    let postParams = {
     token: this.navParams.get("usertoken"),
    user_id: this.navParams.get("userid"),
    channel_id: this.navParams.get("kanalidpost")
    }
    
    this.http.post("https://iothook.com/api/v1.0/channel/detail/", postParams, options)
      .subscribe(data => {
        veri = data['_body'];
         veri=  veri.slice(1, -1);
         veri = veri.replace(/\\/g, "");
         veri = JSON.parse( veri);
        if(!veri.msg_err)
          {
             let alert = this.alertCtrl.create({
              title: 'Kanal Bilgisi',
              message: "<ul><li>KANAL ID: "+veri.channel_list.channel_id_0+"</li><li> KANAL ADI: "+veri.channel_list.channel_name_0+"</li><li>API KEY: "+veri.channel_list.channel_api_key_0+"</li></ul>",
              buttons: ['Tamam']
              });
              alert.present();                    
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
