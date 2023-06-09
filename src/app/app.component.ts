import { Component, ViewChild,AfterViewInit } from '@angular/core';
import{HttpClient}from '@angular/common/http'
import { Observable, catchError, concatMap, of, switchMap } from 'rxjs';
import { WeatherDetailsComponent } from './components/weather-details/weather-details.component';
import { DataTreatService } from './services/data-treat.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  lat: number=0;
 lng: number=0;

 ngOnInit(){
  const hours = this.date.getHours();
  if((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 6)) 
  { this.backgroundImage="./assets/images/nightsky.jpg"
    this.zindex=true
  }
  const city = localStorage.getItem('city')
  if( city ) {
     this.backupDAta=JSON.parse(city)
    this.onGetWeatherData( this.backupDAta.latitude,this.backupDAta.longitude)
  }  else {
    this.getLocation();
   


  } 
 }
 async getExactLoca(alt:number,lng:number){
  const api=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${alt}&longitude=${lng}&localityLanguage=en`
  await this.DataTreatService.getWeatherData(api).subscribe(
    (response)=>{
      this.backupDAta.country=response.countryName
      this.backupDAta.admin2=response.principalSubdivision
      this.backupDAta.admin1=response.locality
      this.backupDAta.latitude=response.latitude
      this.backupDAta.longitude=response.longitude

      console.log("app new backupData" ,this.backupDAta)

    }
  )

 }

   getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.onGetWeatherData(this.lat, this.lng);
         /*  this.backupDAta.latitude=position.coords.latitude
          this.backupDAta.longitude = position.coords.longitude; */
          this.getExactLoca(this.lat, this.lng)
        }
      },
        (error) => alert("Coudn't get  your Location please allow Location Access ."));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    

  }
  
   /* Get country selected data */
    onGetWeatherData(latitude: number,longitude: number) {
    this.loader=true
    const api=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_180m,winddirection_180m&daily=temperature_2m_max,sunrise,sunset,temperature_2m_min&timezone=Europe%2FLondon&daily=weathercode`
    this.DataTreatService.getWeatherData(api).subscribe(
      (response) => {
        this.cityData.daily=response.daily;
        this.cityData.hourly=response.hourly
        if(this.weatherDetailsComponent){
          console.log("in")
          this.weatherDetailsComponent?.updateCityData(this.cityData); 
        this.weatherDetailsComponent?.updateCityName(this.backupDAta); 
        this.weatherDetailsComponent?.hourlyDetails(this.date.toISOString())}
        else console.log("out")
        this.backupDa=true
        this.loader=false
        console.log("app CityData",this.cityData)
      },
      (error) => {
        console.error(error);
      }
    );
  }
  @ViewChild(WeatherDetailsComponent) weatherDetailsComponent: WeatherDetailsComponent |undefined;
constructor(public DataTreatService:DataTreatService,private http:HttpClient){

}
backupDa:boolean=false
  countriesLooder=false
  loader:boolean=false
  showDetails:boolean=false
  searchText: any;
  backgroundImage="./assets/sky.jpg"
  zindex: boolean = false
  cityChosen:any =""
  cityData:any={}
   date= new Date()
  backupDAta:any={}

  
  

  
  /* Remove selected data */
   destroyCity(){
      this.showDetails=false
      localStorage.removeItem('city')
      this.cityData={}
      this.cityChosen=""
      this.searchText=null
   }
 

 
/* Get Images of countries based on  country Code*/
  getImageSource(key: any): string {
    return `./assets/images/png100px/${key.toLowerCase()}.png`;
  }
  /* save country selected*/ 
  setName(event: any){
    localStorage.setItem('city',JSON.stringify(event))
    this.backupDAta=event
    this.onGetWeatherData(event.latitude,event.longitude)
    
    
    

    this.searchText=event.name
    this.getAllPlaces()
  }
 /* search for countries*/
  coutriesSearched:any
  getAllPlaces(): void {
    this.countriesLooder=true
    this.DataTreatService.getWeatherData(`https://geocoding-api.open-meteo.com/v1/search?name=${this.searchText}&count=20&language=en&format=json`).subscribe(
      (response) => {
        this.coutriesSearched=response.results
        this.coutriesSearched.fullName= this.DataTreatService.getLocationDetails(response.results)
        this.countriesLooder=false

      },
      (error) => {console.error(error);}
    );
  }
}
