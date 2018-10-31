import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomePage } from '../home/home';
import { CityListPage } from '../city-list/city-list';


declare var $:any;

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  // city_list = [];

  addPlace:FormGroup;
  newPlace = {
    title:null,
    city:null,
    country:null,
    latitude:null,
    longitude:null,
  }
  ct;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public geolocation: Geolocation,
              public diagnostic: Diagnostic) {

    this.addPlace = formBuilder.group({
      title: ["", Validators.required],
      city: [""],
      country: [""],
      latitude: [null],
      longitude: [null]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  savePlace(){
    // console.log(this.addPlace.value);
    if (this.addPlace.value.city == "" && this.addPlace.value.country == "" && this.addPlace.value.latitude == "" && this.addPlace.value.longitude == ""){
      console.log("all empty");
    }
    else if ((this.addPlace.value.city && this.addPlace.value.country) && (this.addPlace.value.latitude || this.addPlace.value.longitude)){
      console.log("remove coords")
    }
    else if ((this.addPlace.value.latitude && this.addPlace.value.longitude) && (this.addPlace.value.city || this.addPlace.value.country)) {
      console.log("remove city")
    }
    else{
      this.newPlace = this.addPlace.value;
      this.viewCtrl.dismiss(this.newPlace);
    }
  }

  getCurrentLocation() {

    let successCallback = (isAvailable) => {
      console.log('Is available? ' + isAvailable);
      //  this.check = isAvailable;
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
      this.addPlace.patchValue({'latitude':resp.coords.latitude, 'longitude':resp.coords.longitude});
      var currentLocation = { lat: resp.coords.latitude, lng: resp.coords.longitude };
      console.log(currentLocation);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  
  // choseCity(){
  //   let modal = this.modalCtrl.create(CityListPage);
  //   modal.present();
  //   // this.navCtrl.push(CityListPage);
  // }

  // list(){
  //   return this.ct;
  // }

}
