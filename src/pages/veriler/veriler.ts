import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";
import { Storage } from '@ionic/storage';
import { DomSanitizer} from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { ToastController ,Toast} from 'ionic-angular';

/**
 * Generated class for the VerilerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-veriler',
  templateUrl: 'veriler.html',

})
export class VerilerPage {

      public ticks =0;
      private subscription: Subscription;
      i = 5;

      grafikveri;

       grafik = [];
       grafiklamba= [];
  chartOptions : Object;
  chartOptions1 : Object;

  veritext={};

toast: Toast = null;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http,private toastCtrl: ToastController, private storage:Storage,private _sanitizer: DomSanitizer, private alertCtrl: AlertController) {
    
    
    this.chartOptions={
        chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
    },

    title: {
        text: ''
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },

    credits:{
        enabled:false,
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 100,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
          
        },
        plotBands: [{
            from: 0,
            to: 25,
            color: '#63e3f1' // green
        }, {
            from: 25,
            to: 50,
            color: '#DDDF0D' // yellow
        }, {
            from: 50,
            to: 100,
            color: '#DF5353' // red
        }]
    },

    series: [{
     
        data: [0],
  
    }]

    };  

   this.grafikolustur();

  }

  ionViewDidLoad() {
  }



   ngOnInit() {
    let timer = TimerObservable.create(1000, 10000);
    this.subscription = timer.subscribe(t => {
        this.vericek();
    });
      }

    
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  vericek()
  {
      var maxsize=100;
      var veri;
    
    var tok = this.navParams.get("username")+":"+this.navParams.get("password");
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    
    
    this.http.get("https://iothook.com/api/v1.2/datas/?data=last&channel="+this.navParams.get("kanalidpost"), options)
      .subscribe(data => {
        veri = data['_body'];  
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
       
       // this.chartOptions['series'][0].data=[10];
       
       for(var i=0;i<this.grafik.length;i++)
        {
            maxsize=100;
            if(parseInt(veri[this.grafik[i].deger])>maxsize)
              maxsize=parseInt(veri[this.grafik[i].deger]);

            if(this.grafik[i]!=null)
            this.grafik[i]['grafik'] = {
                                    title : { text : veri[this.grafik[i].element] },
                                    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },

      credits:{
        enabled:false,
    },
    yAxis: {
        min: 0,
        max: maxsize,
    
      plotBands: [{
            from: 0,
            to: 25,
            color: '#63e3f1' // green
        }, {
            from: 25,
            to: 50,
            color: '#DDDF0D' // yellow
        }, {
            from: 50,
            to: maxsize,
            color: '#DF5353' // red
        }]
    },
    
        series : [{
            name : 'knowstack',
            data : [parseInt(veri[this.grafik[i].deger])]
        }]
    };
        }

         for(var i=0;i<this.grafiklamba.length;i++)
        {
            if(parseInt(veri[this.grafiklamba[i].deger])<=0)
                {
                    this.grafiklamba[i].acik=false;
                   // this.veritext[this.grafiklamba[i].value]=false;
                }
                

            if(parseInt(veri[this.grafiklamba[i].deger])>0)
                {
                   // this.veritext[this.grafiklamba[i].value]=true;
                    this.grafiklamba[i].acik=true;
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

  /*
  grafikolustur()
  {
       var veri;
    
    var tok = "test:test12345";
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    
    var veris="channel_name_";
    this.http.get("https://iothook.com/api/v1.2/datas/?data=last&channel=108", options)
      .subscribe(data => {
        veri = data['_body'];
        console.log(veri);       
        veri= veri.slice(1, -1);
        veri = veri.replace(/\\/g, "");
        veri = JSON.parse(veri);
        
       
        for(var i=0;i<=10;i++)
            {
                if(veri["element_"+(i+1)]!=null)
                    {
                        this.grafik.push({grafik: this.chartOptions , gorunum:false , value: (i+1)});
                       
                    }
            }
    
    
       }, error => {
        console.log(error);
      });  
  }

*/

  grafikolustur()
  {
     
    var tok = this.navParams.get("username")+":"+this.navParams.get("password");
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    
  
    this.http.get("https://iothook.com/api/v1.2/datas/?data=last&channel="+this.navParams.get("kanalidpost"), options)
      .subscribe(data => {
        this.grafikveri = data['_body'];
        if(this.grafikveri == "[]")       
            {
                 let alert = this.alertCtrl.create({
                title: 'Uyarı',
                subTitle: "Kanalınıza veri akışı gerçekleşmiyor.",
                buttons: ['Tamam']
                });
                alert.present();
                 this.subscription.unsubscribe();
            }

            else
                {
                     this.grafikveri= this.grafikveri.slice(1, -1);
                    this.grafikveri = this.grafikveri.replace(/\\/g, "");
                    this.grafikveri = JSON.parse(this.grafikveri);
                    
                
                    for(var i=0;i<=10;i++)
                        {
                        if(this.grafikveri["element_"+(i+1)]!=null)
                                {
                                this.gettype(i);                       
                                }
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
       
        if(datas=='termometre' || datas==null)
            {
  this.grafik.push({grafik: this.chartOptions , gorunum:false , value: (i+1), element:"element_"+(i+1), deger:"value_"+(i+1)}); 
          
            }

               if(datas=='lamba')
            {
                if(parseInt(this.grafikveri['value_'+(i+1)])>0){
                    this.veritext[i+1]=true;
                    this.grafiklamba.push({gorunum:false , value: (i+1),elementadi:this.grafikveri['element_'+(i+1)], acik:true , element:"element_"+(i+1), deger:"value_"+(i+1) }); 
                }
           
                if(parseInt(this.grafikveri['value_'+(i+1)])<=0)
                    {
                    this.veritext[i+1]=false;
                    this.grafiklamba.push({gorunum:false , value: (i+1),elementadi:this.grafikveri['element_'+(i+1)], acik:false , element:"element_"+(i+1) , deger:"value_"+(i+1)}); 
                    }
           
            }
            
              });  

   }

    getBackground (image) {
    return this._sanitizer.bypassSecurityTrustStyle('url(assets/img/'+image+'.png)');
}


  verigonder(value,islem)
  {
    var deger;
    var i;
    var veri;    
    var tok = this.navParams.get("username")+":"+this.navParams.get("password");;
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
     headers.append('Authorization' , 'Basic '+ btoa(tok));
    let options = new RequestOptions({ headers: headers });
    
    if(islem==1)
        {
            deger=this.veritext[value];
        }
    

   if(islem==2)
    {
    if(this.veritext[value]==true)
        deger=1;
    if(this.veritext[value] == false)
        deger=0;
    }

    let postParams = {
    api_key: this.navParams.get("kanalapikey"),   
    ['value_'+value] : deger,
    }

    this.http.post("https://iothook.com/api/v1.2/datas/", postParams, options)
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
            message: "Veri gönderildi",
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

  private showToast(data:any):void{
        this.toast ? this.toast.dismiss() : false;
        this.toast = this.toastCtrl.create(data);
        this.toast.present();
    }

}
