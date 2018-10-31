import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddPlacePage } from '../pages/add-place/add-place';
import { CityListPage } from '../pages/city-list/city-list';
import { DailyWeatherDetailPage } from '../pages/daily-weather-detail/daily-weather-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { IonicStorageModule } from '@ionic/storage';
import { GetWeatherProvider } from '../providers/get-weather/get-weather';
import { HttpClientModule } from '@angular/common/http';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { Network } from '@ionic-native/network';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddPlacePage,
    CityListPage,
    DailyWeatherDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AutoCompleteModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddPlacePage,
    CityListPage,
    DailyWeatherDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetWeatherProvider,
    Geolocation,
    Network,
    Diagnostic
  ]
})
export class AppModule {}
