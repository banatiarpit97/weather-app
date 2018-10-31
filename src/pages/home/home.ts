import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { GetWeatherProvider } from '../../providers/get-weather/get-weather';
import { Observable } from 'rxjs/Observable';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
// import 'rxjs/add/operator/map';
import { AddPlacePage } from '../add-place/add-place';
import { Storage } from '@ionic/storage';

import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
// import { Network } from '@ionic-native/network';
import { DailyWeatherDetailPage } from '../daily-weather-detail/daily-weather-detail';


declare var $:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  type;
  icon;
  temp_min;
  temp_max;
  allWeathers:any[] = [];
  showWeather = {
    label: "",
    name: "",
    country: "",
    latitude: "",
    longitude: "",
    now: "",
    hourlyForecast: [],
    dailyForecast: []
  }
  placeWeather = {
    label:"",
    name:"",
    country:"",
    latitude:"",
    longitude:"",
    now:null,
    hourlyForecast:[],
    dailyForecast: []
  }
  nowObject = {
    type: null,
    temp: null,
    min_temp: null,
    max_temp: null,
    icon: null,
    date: null,
    time: null,
    completeData:null
  }
  hourObject = {
    type: null,
    temp: null,
    min_temp: null,
    max_temp: null,
    icon: null,
    date: null,
    time: null,
    completeData: null
    
  }
  dailyObject = {
    type: null,
    temp: null,
    min_temp: null,
    max_temp: null,
    icon: null,
    date: null,
    time: null,
    day:null
  }
  completeList;

  networkType = "wifi";
  notAlreadyGot=false;
  appId = "e1cc491bb20471d89ff7f45f7536efa4";
  baseUrl = "http://api.openweathermap.org/data/2.5/";
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  constructor(public navCtrl: NavController,
              public navParams:NavParams,
              public events:Events,
              public getWeather:GetWeatherProvider,
              public modalCtrl:ModalController,
              public alertCtrl:AlertController,
              public toastCtrl:ToastController,
              public storage:Storage,
              public geolocation: Geolocation,
              public diagnostic: Diagnostic,) {


    // this.networkType = this.network.type;            
    // this.storage.remove('weatherList') 
    if(this.navParams.get('place')){
      var place = this.navParams.get('place');
      this.showWeather = this.navParams.get('place');
      if(place.name && place.country){
        this.getWeatherByCityName(place.label, place.name, place.country, "show");
      }
      else if (place.latitude && place.longitude) {
        this.getWeatherByCoordinates(place.label, place.latitude, place.longitude, 'show');
      }
      this.notAlreadyGot=true;
    }           
    else{
      console.log('no')
    }

    this.storage.get('weatherList').then(weatherList => {
      if (weatherList) {
        this.allWeathers = weatherList;
      }
    }) 

    if(!this.notAlreadyGot){
    this.storage.get('currentWeather').then(weather => {
      if(weather){
        this.showWeather = weather;
      }
    })  
    this.getCurrentLocation();
  }
}

  getCurrentLocation(){
    let successCallback = (isAvailable) => {
      if (isAvailable) {

      }
      else {
        let confirm = this.alertCtrl.create({
          title: 'Turn on location sevices',
          message: 'Do you want to switch on location services to access your current location?',
          buttons: [
            {
              text: 'Disagree',
              handler: () => {
                let toast = this.toastCtrl.create({
                  message: "Location services are switched off, we would not be able to access your location.To get your location, either turn on the gps or click on the location button in the app.",
                  duration: 8000,
                  cssClass: 'danger'
                });
                toast.present();
              }
            },
            {
              text: 'Agree',
              handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            }
          ]
        });
        confirm.present();
      }
    };
    let errorCallback = (e) => console.error(e);

    this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
    this.geolocation.getCurrentPosition().then((resp) => {
      var currentLocation = { lat: resp.coords.latitude, lng: resp.coords.longitude };
      console.log(currentLocation);
      this.getWeatherByCoordinates("", resp.coords.latitude, resp.coords.longitude, "start");
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getWeatherByCityName(label, city, country, type){
    var global = this;
    // var appId = "e1cc491bb20471d89ff7f45f7536efa4";
    this.baseUrl = "http://api.openweathermap.org/data/2.5/";
    this.baseUrl += "weather";
    this.baseUrl += "?q=" + city;
    this.baseUrl += "," + country;
    this.baseUrl += "&units=metric";
    this.baseUrl += "&appid=" + this.appId;
    $.ajax({
      url: this.baseUrl,
      type: "POST",
      // async:false,
      success: function (data) {
        console.log(data)
        var date = new Date().getDate() + " " + global.monthNames[new Date().getMonth()] + ", " + new Date().getFullYear();
        var time = new Date().getHours().toLocaleString('en-us', { minimumIntegerDigits: 2 }) + ":" + new Date().getMinutes().toLocaleString('en-us', { minimumIntegerDigits: 2 });
        // console.log(data.weather[0].main);
        global.placeWeather.label = label;
        global.placeWeather.name = data.name;
        global.placeWeather.country = country;
        global.nowObject.type = data.weather[0].main;
        global.nowObject.temp = Math.round((data.main.temp) * 10) / 10;
        global.nowObject.min_temp = Math.round((data.main.temp_min) * 10) / 10;
        global.nowObject.max_temp = Math.round((data.main.temp_max) * 10) / 10;
        global.nowObject.icon = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png";
        global.nowObject.date = date;
        global.nowObject.time = time;
        global.nowObject.completeData = data;
        console.log(global.placeWeather);

        global.placeWeather.now = global.nowObject;
        


        global.getForcastByCityName(label, city, country, 7, type);
        
      },
      error: function () {
        console.log("error");
      }
    })
  }


  getForcastByCityName(label, city, country, days, type) {
    var global = this;
    var hourly = [];
    var daily = [];
    // this.appId = "e1cc491bb20471d89ff7f45f7536efa4";
    this.baseUrl = "http://api.openweathermap.org/data/2.5/";
    this.baseUrl += "forecast";
    this.baseUrl += "?q=" + city;
    this.baseUrl += "," + country;
    this.baseUrl += "&units=metric";
    // this.baseUrl += "&cnt="+days;
    this.baseUrl += "&appid=" + this.appId;
    $.ajax({
      url: this.baseUrl,
      type: "POST",
      // async:false,
      success: function (data) {
        console.log(data);
        this.completeList = data.list;
        // var date = new Date().getDate() + " " + global.monthNames[new Date().getMonth()] + ", " + new Date().getFullYear();
        // var time = new Date().getHours().toLocaleString('en-us', { minimumIntegerDigits: 2 }) + ":" + new Date().getMinutes().toLocaleString('en-us', { minimumIntegerDigits: 2 });
        // // console.log(data.weather[0].main);
        // global.placeWeather.name = data.city.name;
        var date = new Date().getDate().toLocaleString('en-us', { minimumIntegerDigits: 2 });
        var curhrs = parseInt(new Date().getHours().toLocaleString('en-us', { minimumIntegerDigits: 2 }));
        // var datahrs = hour.dt_txt.split(" ")[1].split(':')[0];
        if(curhrs >= 0 && curhrs < 3){
          var showhrs = "00:00";          
        }
        else if (curhrs >= 3 && curhrs < 6) {
          showhrs = "03:00";
        }
        else if (curhrs >= 6 && curhrs < 9) {
          showhrs = "06:00";
        }
        else if (curhrs >= 9 && curhrs < 12) {
          showhrs = "09:00";
        }
        else if (curhrs >= 12 && curhrs < 15) {
          showhrs = "12:00";
        }
        else if (curhrs >= 15 && curhrs < 18) {
          showhrs = "15:00";
        }
        else if (curhrs >= 18 && curhrs < 21) {
          showhrs = "18:00";
        }
        else if (curhrs >= 21) {
          showhrs = "21:00";
        }
        console.log(curhrs, showhrs);
        for(let i=0;i<8;i++){
          global.hourObject = {
            type: null,
            temp: null,
            min_temp: null,
            max_temp: null,
            icon: null,
            date: null,
            time: null,
            completeData: null
            
          }
          var hour = data.list[i];
          if (date == hour.dt_txt.split(" ")[0].split("-")[2]){
          global.hourObject.completeData = data.list[i];
          global.hourObject.type = hour.weather[0].main;
          global.hourObject.temp = Math.round((hour.main.temp) * 10) / 10
          global.hourObject.min_temp = Math.round((hour.main.temp_min) * 10) / 10;
          global.hourObject.max_temp = Math.round((hour.main.temp_max) * 10) / 10;
          global.hourObject.icon = "http://openweathermap.org/img/w/" + hour.weather[0].icon + ".png";
          global.hourObject.date = hour.dt_txt.split(" ")[0];
          global.hourObject.time = hour.dt_txt.split(" ")[1].split(':')[0] + ":" + hour.dt_txt.split(" ")[1].split(':')[1];
          hourly.push(global.hourObject);
        }
        global.placeWeather.hourlyForecast = hourly;
      }

        for (let j = 0;j < 40; j++) {
          global.dailyObject = {
            type: null,
            temp: null,
            min_temp: null,
            max_temp: null,
            icon: null,
            date: null, 
            time: null,
            day:null
          }
          var day = data.list[j];
            if(day){
              if ((date != day.dt_txt.split(" ")[0].split("-")[2]) && (day.dt_txt.split(" ")[1].split(':')[0] + ":" + day.dt_txt.split(" ")[1].split(':')[1] == showhrs)) {
              
            global.dailyObject.type = day.weather[0].main;
            global.dailyObject.temp = Math.round((day.main.temp) * 10) / 10;
            global.dailyObject.min_temp = Math.round((day.main.temp_min) * 10) / 10;
            global.dailyObject.max_temp = Math.round((day.main.temp_max) * 10) / 10;
            global.dailyObject.icon = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
            global.dailyObject.date = day.dt_txt.split(" ")[0];
            global.dailyObject.time = day.dt_txt.split(" ")[1].split(':')[0] + ":" + day.dt_txt.split(" ")[1].split(':')[1];
            global.dailyObject.day = global.dayNames[new Date(day.dt_txt.split(" ")[0]).getDay()];
            daily.push(global.dailyObject);
          }
        }
        global.placeWeather.dailyForecast = daily;
      }

        if(type == 'show'){
          global.showWeather = global.placeWeather;
          for (let k=0;k<global.allWeathers.length;k++){
            if(global.allWeathers[k].label ==  label){
              global.allWeathers[k] = global.placeWeather;
              global.storage.set('weatherList', global.allWeathers);
              break;
            }
          }
        }
        else if(type =='add'){
          global.allWeathers.push(global.placeWeather);
          global.storage.set('weatherList', global.allWeathers);
          global.events.publish('weatherList', global.allWeathers);          
        }
      },
      error: function () {
        console.log("error");
      }
    })
  }

  getWeatherByCoordinates(label, latitude, longitude, type) {
    var global = this;
    // var appId = "e1cc491bb20471d89ff7f45f7536efa4";
    this.baseUrl = "http://api.openweathermap.org/data/2.5/";
    this.baseUrl += "weather";
    this.baseUrl += "?lat=" + latitude;
    this.baseUrl += "&lon="+longitude;
    this.baseUrl += "&units=metric";
    this.baseUrl += "&appid=" + this.appId;
    $.ajax({
      url: this.baseUrl,
      type: "POST",
      async:false,
      success: function (data) {
        var date = new Date().getDate() + " " + global.monthNames[new Date().getMonth()] + ", " + new Date().getFullYear();
        var time = new Date().getHours().toLocaleString('en-us', { minimumIntegerDigits: 2 }) + ":" + new Date().getMinutes().toLocaleString('en-us', { minimumIntegerDigits: 2 });
        // console.log(data.weather[0].main);
        global.placeWeather.name = data.name;
        if(label){
          global.placeWeather.label = label;
        }
        else{
          global.placeWeather.label = data.name;
        }
        global.nowObject.type = data.weather[0].main;
        global.nowObject.temp = Math.round((data.main.temp) * 10) / 10;
        global.nowObject.min_temp = Math.round((data.main.temp_min) * 10) / 10;
        global.nowObject.max_temp = Math.round((data.main.temp_max) * 10) / 10;
        global.nowObject.icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        global.nowObject.date = date;
        global.nowObject.time = time;
        global.nowObject.completeData = data;

        global.placeWeather.now = global.nowObject;
        global.placeWeather.latitude = latitude;
        global.placeWeather.longitude = longitude;



        global.getForcastByCoordinates(label, latitude, longitude, type);

      },
      error: function () {
        console.log("error");
      }
    })
  }


  getForcastByCoordinates(label, latitude, longitude, type) {
    var global = this;
    var hourly = [];
    var daily = [];
    // this.appId = "e1cc491bb20471d89ff7f45f7536efa4";
    this.baseUrl = "http://api.openweathermap.org/data/2.5/";
    this.baseUrl += "forecast";
    this.baseUrl += "?lat=" + latitude;
    this.baseUrl += "&lon=" + longitude;
    this.baseUrl += "&units=metric";
    this.baseUrl += "&appid=" + this.appId;
    $.ajax({
      url: this.baseUrl,
      type: "POST",
      async:false,
      success: function (data) {
        global.completeList = data.list;
        var date = new Date().getDate().toLocaleString('en-us', { minimumIntegerDigits: 2 });
        var curhrs = parseInt(new Date().getHours().toLocaleString('en-us', { minimumIntegerDigits: 2 }));
        if (curhrs >= 0 && curhrs < 3) {
          var showhrs = "00:00";
        }
        else if (curhrs >= 3 && curhrs < 6) {
          showhrs = "03:00";
        }
        else if (curhrs >= 6 && curhrs < 9) {
          showhrs = "06:00";
        }
        else if (curhrs >= 9 && curhrs < 12) {
          showhrs = "09:00";
        }
        else if (curhrs >= 12 && curhrs < 15) {
          showhrs = "12:00";
        }
        else if (curhrs >= 15 && curhrs < 18) {
          showhrs = "15:00";
        }
        else if (curhrs >= 18 && curhrs < 21) {
          showhrs = "18:00";
        }
        else if (curhrs >= 21) {
          showhrs = "21:00";
        }
        console.log(showhrs)
        
        for (let i = 0; i < 8; i++) {
          global.hourObject = {
            type: null,
            temp: null,
            min_temp: null,
            max_temp: null,
            icon: null,
            date: null,
            time: null,
            completeData:null
          }
          var hour = data.list[i];
          if(hour){
          if (date == hour.dt_txt.split(" ")[0].split("-")[2]) {
          
          global.hourObject.completeData = data.list[i];
          global.hourObject.type = hour.weather[0].main;
          global.hourObject.temp = Math.round((hour.main.temp) * 10) / 10
          global.hourObject.min_temp = Math.round((hour.main.temp_min) * 10) / 10;
          global.hourObject.max_temp = Math.round((hour.main.temp_max) * 10) / 10;
          global.hourObject.icon = "http://openweathermap.org/img/w/" + hour.weather[0].icon + ".png";
          global.hourObject.date = hour.dt_txt.split(" ")[0];
          global.hourObject.time = hour.dt_txt.split(" ")[1].split(':')[0] + ":" + hour.dt_txt.split(" ")[1].split(':')[1];
          hourly.push(global.hourObject);
        }
      }
        global.placeWeather.hourlyForecast = hourly;
      }

        for (let j = 0; j < 40; j++) {
          global.dailyObject = {
            type: null,
            temp: null,
            min_temp: null,
            max_temp: null,
            icon: null,
            date: null,
            time: null,
            day: null
          }
          var day = data.list[j];
          if(day){
            if ((date != day.dt_txt.split(" ")[0].split("-")[2]) && (day.dt_txt.split(" ")[1].split(':')[0] + ":" + day.dt_txt.split(" ")[1].split(':')[1] == showhrs)) {
            global.dailyObject.type = day.weather[0].main;
            global.dailyObject.temp = Math.round((day.main.temp) * 10) / 10;
            global.dailyObject.min_temp = Math.round((day.main.temp_min) * 10) / 10;
            global.dailyObject.max_temp = Math.round((day.main.temp_max) * 10) / 10;
            global.dailyObject.icon = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
            global.dailyObject.date = day.dt_txt.split(" ")[0];
            global.dailyObject.time = day.dt_txt.split(" ")[1].split(':')[0] + ":" + day.dt_txt.split(" ")[1].split(':')[1];
            global.dailyObject.day = global.dayNames[new Date(day.dt_txt.split(" ")[0]).getDay()];
            daily.push(global.dailyObject);
          }
        }
        global.placeWeather.dailyForecast = daily;
      }
        if(type == 'start'){
          global.storage.set('currentWeather', global.placeWeather);
        }
        else if(type =='add'){
          global.allWeathers.push(global.placeWeather);
          global.storage.set('weatherList', global.allWeathers);
          global.events.publish('weatherList', global.allWeathers);
        }
        else if(type == "show"){
          global.showWeather = global.placeWeather;
          setTimeout(function(){console.log(global.allWeathers)
          for (let k = 0; k < global.allWeathers.length; k++) {
            if (global.allWeathers[k].label == label) {
              global.allWeathers[k] = global.placeWeather;
              global.storage.set('weatherList', global.allWeathers);
              break;
            }
          }
          }, 500);
        }
      },
      error: function () {
        console.log("error");
      }
    })
  }


  addPlace(){
    let modal = this.modalCtrl.create(AddPlacePage);
    modal.present();
    modal.onDidDismiss(item => {
      if(item){
        if(item.city && item.country){
          this.getWeatherByCityName(item.title, item.city, item.country, 'add');
        }
        else if (item.longitude && item.latitude) {
          if(item.title){
            var label = item.title;
          }
          else{
            label = "";
          }
          this.getWeatherByCoordinates(label, item.latitude, item.longitude, "add");
        }
      }
    })
  }

  refresh(e){
    if (this.showWeather.name && this.showWeather.country) {
      this.getWeatherByCityName(this.showWeather.label, this.showWeather.name, this.showWeather.country, "show");
      e.complete();
    }
    else if (this.showWeather.latitude && this.showWeather.longitude) {
      this.getWeatherByCoordinates(this.showWeather.label, this.showWeather.latitude, this.showWeather.longitude, 'show');
      e.complete();
      
    }
  }

    showHourDetails(hour) {
      var tillHour = (parseInt(hour.completeData.dt_txt.split(" ")[1].split(":")[0]) + 3).toLocaleString('en-us', { minimumIntegerDigits: 2 })+":00:00";
      let content = "<p><b>Place : </b>" + this.showWeather.name +
                    "</p><p><b>Date : </b>" + hour.completeData.dt_txt.split(" ")[0] + 
                    "</p><p><b>Time : </b>" + hour.completeData.dt_txt.split(" ")[1] +" - " + tillHour +
                    "</p><p><b>Temperature : </b>"+hour.completeData.main.temp+
                    "</p><p><b>Min temperature : </b>"+hour.completeData.main.temp_min+
                    "</p><p><b>Max Tempperature : </b>"+hour.completeData.main.temp_max+
                    "</p><p><b>Description : </b>" + hour.completeData.weather[0].description+
                    "</p><p></p>"+
                    "</p><p><b>Humidity : </b>"+hour.completeData.main.humidity+
                    "</p><p><b>Pressure : </b>"+hour.completeData.main.pressure+
                    "</p><p><b>Ground level : </b>"+hour.completeData.main.grnd_level+
                    "</p><p><b>Sea Level : </b>"+hour.completeData.main.sea_level+
                    "</p><p><b>Temperature kf : </b>"+hour.completeData.main.temp_kf+
                    "</p><p><b>Wind Speed : </b>"+hour.completeData.wind.speed+
                    "</p><p><b>Wind Degree : </b>"+hour.completeData.wind.deg;
      let alert = this.alertCtrl.create({
        title: 'Detailed Report',
        subTitle: content,
        buttons: ['OK'],
        cssClass:"scroll"
      });
      alert.present();
    }

  showNowDetails(nw) {
    let content = "<p><b>Temperature : </b>" + nw.now.completeData.main.temp +
      "</p><p><b>Min temperature : </b>" + nw.now.completeData.main.temp_min +
      "</p><p><b>Max Tempperature : </b>" + nw.now.completeData.main.temp_max +
      "</p><p><b>Description : </b>" + nw.now.completeData.weather[0].description +
      "</p><p><b>Humidity : </b>" + nw.now.completeData.main.humidity +
      "</p><p><b>Pressure : </b>" + nw.now.completeData.main.pressure +
      "</p><p><b>Wind Speed : </b>" + nw.now.completeData.wind.speed +
      "</p><p><b>Wind Degree : </b>" + nw.now.completeData.wind.deg;
    let alert = this.alertCtrl.create({
      title: 'Detailed Report',
      subTitle: content,
      buttons: ['OK'],
      cssClass: "scroll"
    });
    alert.present();
  }

  showDailyDetails(date, time){
    console.log(this.completeList)
    this.navCtrl.setRoot(DailyWeatherDetailPage, {label:this.showWeather.label, name:this.showWeather.name, date:date, time:time, list:this.completeList});
  }




}
