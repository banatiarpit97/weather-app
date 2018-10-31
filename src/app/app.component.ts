import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  places = [];

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage:Storage, public events:Events) {
    this.initializeApp();


    this.storage.get('weatherList').then(places => {
      if (places) {
        this.places = places;
      }
      else{
        this.places = null;
      }
    })  

    this.events.subscribe('weatherList', (allWeathers) => {
      this.places = allWeathers;
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Current Weather', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openPlace(place){
    this.nav.setRoot(HomePage, {place:place});
  }

  deletePlace(place){
    var index = this.places.indexOf(place);
    this.places[index] = "";
    for(let i = index;i<this.places.length;i++){
      this.places[i] = this.places[i+1];
    }
    this.places.pop();
    if(this.places.length == 0){
      this.places = null;
      
    }
    this.storage.set('weatherList', this.places);
  }
}
