import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { GetlerPage } from '../getler/getler';
import { ToastController , Toast} from 'ionic-angular';
/**
 * Generated class for the ElementolusturPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-elementolustur',
  templateUrl: 'elementolustur.html',
  
})
export class ElementolusturPage {

  element= {};
  toast: Toast = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http : Http ,private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
  }


  elementolustur()
  {
    var veri;   
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );  
    //headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    let postParams = {
    token:  this.navParams.get("usertoken"),
    user_id: this.navParams.get("userid"),
    channel_id:  this.navParams.get("kanalidpost"),
    name: this.element['adi'],
    description:  this.element['aciklama'],
    }
    
    this.http.post("https://iothook.com/api/v1.0/element/create/", postParams, options)
      .subscribe(data => {
        veri = data['_body']; 
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
        if(veri.msg_ok){
         let toast = this.toastCtrl.create({
            message: veri.msg_ok,
            duration: 1000,
            position: 'bottom'
          });
           toast.present();
        this.navCtrl.push(GetlerPage, {
        kanalidpost: this.navParams.get("kanalidpost"),
        kanalapikey: this.navParams.get("kanalapikey"),
        usertoken: this.navParams.get("usertoken"),
        userid : this.navParams.get("userid"),
        username: this.navParams.get("username"),
        password : this.navParams.get("password")
    })
        }
        //400 error send
         if(veri.msg_err){
           let toastData = {
            message: veri.msg_err + "yada boş alan bırakmış olabilirsiniz",
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
