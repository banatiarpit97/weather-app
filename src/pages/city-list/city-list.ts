import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CityListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var $:any;

@Component({
  selector: 'page-city-list',
  templateUrl: 'city-list.html',
})
export class CityListPage {
  
  city_list = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
    this.getAllCities();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CityListPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  getAllCities() {
    var global = this;
    $.ajax({
      url: "../assets/data/data.json",
      type: "GET",
      async: false,
      success: function (data) {
        // console.log(data);
        for (let i = 0; i < 10000; i++) {
          global.city_list.push(data[i].name)
        }
        // console.log(global.city_list);
      },
      error: function () {
        console.log("error");
      }
    })
  }

}
