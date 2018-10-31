import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-daily-weather-detail',
  templateUrl: 'daily-weather-detail.html',
})
export class DailyWeatherDetailPage {
 label;
 name;
 date;
 time;
 list;
 nw = {
    date:null,
    time: null,
    icon: null,
    day:null,
    tmp: null,
    all: null
  }
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

 hours = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
    this.label = this.navParams.get('label');
    this.name = this.navParams.get('name');
    this.date = this.navParams.get('date');
    this.time = this.navParams.get('time')+":00";
    this.list = this.navParams.get('list');
    this.now()
    this.hourly();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailyWeatherDetailPage');
  }

  now(){
    for (let i = 0; i < this.list.length; i++) {
      if ((this.list[i].dt_txt.split(" ")[0]) == this.date && (this.list[i].dt_txt.split(" ")[1]) == this.time) {
        this.nw = {
          date:null,
          time: null,
          icon: null,
          tmp:null,
          day:null,
          all: null
        }
        console.log(this.list[i])
        this.nw.date = this.list[i].dt_txt.split(" ")[0];
        this.nw.time = this.list[i].dt_txt.split(" ")[1].split(":")[0] + ":00";
        this.nw.icon = "http://openweathermap.org/img/w/" + this.list[i].weather[0].icon + ".png";
        this.nw.tmp = Math.round((this.list[i].main.temp) * 10) / 10;
        this.nw.day = this.dayNames[new Date(this.list[i].dt_txt.split(" ")[0]).getDay()]
        this.nw.all = this.list[i];
        break;
      }
    }
  }

  hourly(){
  for(let i=0;i<this.list.length;i++){
      if(this.list[i].dt_txt.split(" ")[0] == this.date){
        var hr = {
          time:null,
          icon:null,
          all:null
        }
        hr.time = this.list[i].dt_txt.split(" ")[1].split(":")[0]+":00";
        hr.icon = "http://openweathermap.org/img/w/" + this.list[i].weather[0].icon + ".png";
        hr.all = this.list[i];
        this.hours.push(hr);
      }
   }
  }

    showNowDetails(now) {
    // console.log(now);
      let content = "<p><b>Temperature : </b>" + now.all.main.temp +
        "</p><p><b>Min temperature : </b>" + now.all.main.temp_min +
        "</p><p><b>Max Tempperature : </b>" + now.all.main.temp_max +
      "</p><p><b>Description : </b>" + now.all.weather[0].description +
      "</p><p><b>Humidity : </b>" + now.all.main.humidity +
      "</p><p><b>Pressure : </b>" + now.all.main.pressure +
      "</p><p><b>Ground level : </b>" + now.all.main.grnd_level +
      "</p><p><b>Sea Level : </b>" + now.all.main.sea_level +
      "</p><p><b>Temperature kf : </b>" + now.all.main.temp_kf +
      "</p><p><b>Wind Speed : </b>" + now.all.wind.speed +
      "</p><p><b>Wind Degree : </b>" + now.all.wind.deg;
    let alert = this.alertCtrl.create({
      title: 'Detailed Report',
      subTitle: content,
      buttons: ['OK'],
      cssClass: "scroll"
    });
    alert.present();
  }

  showHourDetails(hour) {
    console.log(hour);
    var tillHour = (parseInt(hour.all.dt_txt.split(" ")[1].split(":")[0]) + 3).toLocaleString('en-us', { minimumIntegerDigits: 2 }) + ":00:00";
    console.log(tillHour)
    let content = "<p><b>Place : </b>" + this.name +
      "</p><p><b>Date : </b>" + hour.all.dt_txt.split(" ")[0] +
      "</p><p><b>Time : </b>" + hour.all.dt_txt.split(" ")[1] + " - " + tillHour +
      "</p><p><b>Temperature : </b>" + hour.all.main.temp +
      "</p><p><b>Min temperature : </b>" + hour.all.main.temp_min +
      "</p><p><b>Max Tempperature : </b>" + hour.all.main.temp_max +
      "</p><p><b>Description : </b>" + hour.all.weather[0].description +
      "</p><p></p>" +
      "</p><p><b>Humidity : </b>" + hour.all.main.humidity +
      "</p><p><b>Pressure : </b>" + hour.all.main.pressure +
      "</p><p><b>Ground level : </b>" + hour.all.main.grnd_level +
      "</p><p><b>Sea Level : </b>" + hour.all.main.sea_level +
      "</p><p><b>Temperature kf : </b>" + hour.all.main.temp_kf +
      "</p><p><b>Wind Speed : </b>" + hour.all.wind.speed +
      "</p><p><b>Wind Degree : </b>" + hour.all.wind.deg;
    let alert = this.alertCtrl.create({
      title: 'Detailed Report',
      subTitle: content,
      buttons: ['OK'],
      cssClass: "scroll"
    });
    alert.present();
  }

  dismiss(){
    this.navCtrl.setRoot(HomePage);
  }

}
