import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { KanalPage } from '../kanallistele/kanallistele';
import { DbProvider } from '../../providers/db/db';
import { TabsPage } from '../tabs/tabs';
import { Platform } from 'ionic-angular';
import { ToastController ,Toast } from 'ionic-angular';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-uyelik',
  templateUrl: 'uyelik.html',
})
export class UyelikPage {
  uyelik = {};
  sifre = {};
  user = {};

  kanalpage = KanalPage;

 toast: Toast = null;
  public uyeoldiv: boolean = false;
  public sifremiunuttumdiv: boolean = false;
  public uyegirisdiv: boolean = true;
   public unregisterBackButtonAction: any;
  constructor(public navCtrl: NavController, private platform: Platform,private toastCtrl: ToastController ,public navParams: NavParams, public http: Http,private databaseprovider: DbProvider,public events: Events) {

   
    if(navParams.get("islem")=="3")
      {
        this.uyegirisdiv=true;
        this.uyeoldiv=false;
        this.sifremiunuttumdiv=false;
      }

   
      
  }

  geri()
  {
     this.platform.exitApp();
  }
    ionViewDidEnter() {
        this.initializeBackButtonCustomHandler();
       
    }

    ionViewWillLeave() {
        // Unregister the custom back button action for this page
        this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    }

    public initializeBackButtonCustomHandler(): void {
        this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
            this.customHandleBackButton();
        }, 10);
    }

    private customHandleBackButton(): void {
       this.platform.exitApp();
    }

   uyelikislem(islem)
  {
       if(islem.id=="1")
      {
        this.sifremiunuttumdiv=true;
        this.uyeoldiv=false;
        this.uyegirisdiv=false;
      }
    
    if(islem.id=="2") 
      {
         this.uyeoldiv=true;
         this.uyegirisdiv=false;
         this.sifremiunuttumdiv=false;
      }  

       if(islem.id=="3") 
      {
         this.uyeoldiv=false;
         this.uyegirisdiv=true;
         this.sifremiunuttumdiv=false;
      }  
  }

  addUser(username,password,eposta,user_id,token,ad,soyad) {
    this.databaseprovider.addUser(username,password,eposta,user_id,token,ad,soyad)
    .then(data => {
    });
    this.user = {};
  }


  uyegiris()
{
  var veri;
   var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    let postParams = {
      username:this.user['usernameil'],
      password:this.user['password'],
    }
    
      this.http.post("https://iothook.com/api/v1.0/users/login/", postParams, options)
      .subscribe(data => {
        veri = data['_body'];
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
        if(veri.msg_err)
          {
            let toastData = {
            message: veri.msg_err,
            duration: 2000,
            position: 'bottom'
        }
        this.showToast(toastData);    
        }
        else
           { 
            let toastData = {
            message: veri.msg_ok,
            duration: 1000,
            position: 'bottom'
        }
        this.showToast(toastData);    
              this.addUser(veri.username,this.user['password'],"",veri.user_id,veri.token,veri.first_name,veri.last_name);
              this.navCtrl.push(TabsPage);
              this.events.publish('user:login');
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

  uyeOl() {
    var veri;
    if(this.uyelik['password'] == this.uyelik['repassword'])
      {
   // var tok = "test:test12345";
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );  
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    let postParams = {
      username: this.uyelik['username'],
      email:this.uyelik['email'],
      password:this.uyelik['password']
    }
    
    this.http.post("https://iothook.com/api/v1.0/users/create/", postParams, options)
      .subscribe(data => {
        veri = data['_body'];        
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
        if(veri.msg_ok){
          let toastData = {
            message: veri.msg_ok,
            duration: 1000,
            position: 'bottom'
        }
        this.showToast(toastData);    
        this.databaseprovider.deleteuser();
         this.uyeoldiv=false;
         this.uyegirisdiv=true;
         this.sifremiunuttumdiv=false;
        }
       else
        {
       let toastData = {
            message: veri.msg_err,
            duration: 1000,
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

       else
      {
       let toastData = {
            message: "Şifreler aynı değil",
            duration: 2000,
            position: 'bottom'
        }
        this.showToast(toastData);    
      }
  }


  sifremiunuttum()
  {
    var veri;
   var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    let postParams = {
      username: this.sifre['usernameil'],
    }
    
      this.http.post("https://iothook.com/api/v1.0/users/forget-password/", postParams, options)
      .subscribe(data => {
        veri = data['_body'];
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
        if(veri.msg_err)
          {
           let toastData = {
            message: veri.msg_err,
            duration: 2000,
            position: 'bottom'
        }
        this.showToast(toastData);    
        }
        else
           { 
            let toastData = {
            message: veri.msg_ok,
            duration: 1000,
            position: 'bottom'
        }
        this.showToast(toastData);    
         this.databaseprovider.deleteuser();
         this.uyeoldiv=false;
         this.uyegirisdiv=true;
         this.sifremiunuttumdiv=false;
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
