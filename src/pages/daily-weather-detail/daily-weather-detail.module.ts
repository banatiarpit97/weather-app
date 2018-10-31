import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyWeatherDetailPage } from './daily-weather-detail';

@NgModule({
  declarations: [
    DailyWeatherDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DailyWeatherDetailPage),
  ],
})
export class DailyWeatherDetailPageModule {}
