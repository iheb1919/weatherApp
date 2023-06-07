import { Component, ViewChild } from '@angular/core';
import{HttpClient}from '@angular/common/http'
import { Observable, catchError, concatMap, of, switchMap } from 'rxjs';
import { WeatherDetailsComponent } from './components/weather-details/weather-details.component';
import { DataTreatService } from './services/data-treat.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(WeatherDetailsComponent) weatherDetailsComponent: WeatherDetailsComponent |undefined;
constructor(private DataTreatService:DataTreatService,private http:HttpClient){
  const city = localStorage.getItem('city')
    if( city ) {
      this.cityChosen=JSON.parse(city)
     this.onGetWeatherData(this.cityChosen.latitude,this.cityChosen.longitude)
    }
}
  showDetails:boolean=false
  searchText: any;
  backgroundImage="./assets/sky.jpg"
  zindex: boolean = false
  cityChosen:any =""
  cityData:any={}
   date= new Date()
  backupDAta:any={}
   ngOnInit(){

    const hours = this.date.getHours();
    if((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 6)) 
    { this.backgroundImage="./assets/images/nightsky.jpg"
      this.zindex=true
    }
    const city = localStorage.getItem('city')
    if( city ) {
      this.cityData=JSON.parse(city)
    }
    else {
     
      let ip:any
      this.http.get('http://api.ipify.org/?format=json')
      .pipe(
        switchMap((res: any) => {
          const ip = res.ip;
  
          return this.http.get(`http://api.ipstack.com/197.11.161.219?access_key=bead45e80a55de67c7e7c7cfb6964e1d`);
        }),
        catchError((error) => {
          // Handle the error
          console.error('Error:', error);
          return of(null); // Return an empty observable or default value if needed
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.backupDAta = res;
          this.getLocation();
        } else {
          // Handle the case where the second request failed or returned null
        }
      });
   


        




    } 
   }
  
   /**Location  */
   getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
         this.onGetWeatherData(latitude,longitude)
        
        });
    } else {
       console.log("No support for geolocation")
    }
  }

 

   /* Remove selected data */
   destroyCity(){
      this.showDetails=false
      localStorage.removeItem('city')
      this.cityData={}
      this.cityChosen=""
      this.searchText=null
   }
 
   /* Get country selected data */
  onGetWeatherData(latitude: number,longitude: number): void {
    const api=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_180m,winddirection_180m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon&daily=weathercode`
    //const api=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover,windspeed_180m,winddirection_180m&daily=temperature_2m_max,temperature_2m_min,uv_index_clear_sky_max&timezone=Europe%2FLondon&daily=weathercode`
    this.DataTreatService.getWeatherData(api).subscribe(
      (response) => {
        this.cityData.daily=response.daily;
        this.cityData.hourly=response.hourly
        this.weatherDetailsComponent?.updateCityData(response);
        this.weatherDetailsComponent?.hourlyDetails(this.date.toISOString())
      },
      (error) => {
        console.error(error);
      }
    );
  }
 
/* Get Images of countries based on  country Code*/
  getImageSource(key: any): string {
    return `./assets/images/png100px/${key.toLowerCase()}.png`;
  }
  /* save country selected*/ 
  setName(event: any){
    localStorage.setItem('city',JSON.stringify(event))
    this.onGetWeatherData(event.latitude,event.longitude)
    this.weatherDetailsComponent?.updateCityName(event);
  }
 /* search for countries*/
  coutriesSearched:any
  getAllPlaces(): void {
    this.DataTreatService.getWeatherData(`https://geocoding-api.open-meteo.com/v1/search?name=${this.searchText}&count=20&language=en&format=json`).subscribe(
      (response) => {
        this.coutriesSearched=response.results
      },
      (error) => {console.error(error);}
    );
  }
 


}
