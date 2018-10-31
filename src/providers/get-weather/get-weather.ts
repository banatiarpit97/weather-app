import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GetWeatherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetWeatherProvider {
  appId = "e1cc491bb20471d89ff7f45f7536efa4";
  baseUrl = "http://api.openweathermap.org/data/2.5/";

  constructor(public http: HttpClient) {
  }

  byCityName(city:string, country:string){
    this.baseUrl += "weather";
    this.baseUrl += "?q="+city;
    this.baseUrl += "," + country;
    this.baseUrl += "&units=metric";
    this.baseUrl += "&appid=" + this.appId;



    return this.http.get(this.baseUrl);
  }

}
