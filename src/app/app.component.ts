import { Component, ViewChild } from '@angular/core';
import{HttpClient}from '@angular/common/http'
import { Observable } from 'rxjs';
import { WeatherDetailsComponent } from './components/weather-details/weather-details.component';
import { DataTreatService } from './services/data-treat.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(WeatherDetailsComponent) weatherDetailsComponent: WeatherDetailsComponent | undefined;
constructor(private DataTreatService:DataTreatService,private http:HttpClient){
}
showDetails:boolean=false
searchText: any;
  backgroundImage="./assets/sky.jpg"
  zindex: boolean = false
  
  cityChosen:any =""

   cityData:any
   ngOnInit(){
    const date= new Date()
    const hours = date.getHours();
    if(!(hours >= 19 && hours <= 23) && (hours >= 0 && hours <= 6)) 
    { this.backgroundImage="./assets/images/nightsky.jpg"
      this.zindex=true
    }
    const city = localStorage.getItem('city')
    if( city ) {
      this.cityChosen=JSON.parse(city)
     this.onGetWeatherData(this.cityChosen.latitude,this.cityChosen.longitude)
    }
   }
   destroyCity(){
      this.showDetails=false
      localStorage.removeItem('city')
      this.cityData=null
      this.cityChosen=""
   }
   
  onGetWeatherData(latitude: number,longitude: number): void {
    const api=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover,windspeed_180m,winddirection_180m&daily=temperature_2m_max,temperature_2m_min,uv_index_clear_sky_max&timezone=Europe%2FLondon&daily=weathercode`
    this.DataTreatService.getWeatherData(api).subscribe(
      (response) => {
        this.cityData=response
        this.weatherDetailsComponent?.updateCityData(response);
        this.weatherDetailsComponent?.update()
      },
      (error) => {
        console.error(error);
      }
    );
  }
 

  getImageSource(key: any): string {
    return `./assets/images/png100px/${key.toLowerCase()}.png`;
  }
  setName(event: any){
    localStorage.setItem('city',JSON.stringify(event))
    this.onGetWeatherData(event.latitude,event.longitude)
    this.weatherDetailsComponent?.updateCityName(event);
  }
 
  tryThis:any
  onData(): void {
    this.DataTreatService.getWeatherData(`https://geocoding-api.open-meteo.com/v1/search?name=${this.searchText}&count=20&language=en&format=json`).subscribe(
      (response) => {
        this.tryThis=response.results
      },
      (error) => {console.error(error);}
    );
  }

}
