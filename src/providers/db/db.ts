import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import {Storage} from '@ionic/storage';
@Injectable()
export class DbProvider {

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  
    constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'iothook.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }

  fillDatabase()
  {
    this.http.get('assets/iothook.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  addUser(username,password,eposta,user_id,token,ad,soyad)
  {
    let data = [username, password,eposta, user_id, token,ad,soyad]
    return this.database.executeSql("INSERT INTO user (username, password, eposta ,user_id,token,ad,soyad) VALUES (?, ?, ?, ?,?,?,?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllUser()
  {
      return this.database.executeSql("SELECT * FROM user", []).then((data) => {
      let users = [];
      if (data.rows.length > 0) {
        //for (var i = 0; i < data.rows.length; i++) {
          users.push({ username: data.rows.item(0).username, password: data.rows.item(0).password, eposta:data.rows.item(0).eposta, user_id: data.rows.item(0).user_id, token: data.rows.item(0).token,ad: data.rows.item(0).ad,soyad: data.rows.item(0).soyad });
       // }
      }
      else
        {
          users.push({hata:"kullanıcı yok"});
        }
      return users;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
  getDatabaseState()
  {
      return this.databaseReady.asObservable();
  }

  deleteuser()
  {
    return this.database.executeSql("DELETE FROM user",[]).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }
}
