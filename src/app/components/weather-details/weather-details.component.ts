import { Component,EventEmitter,Input, Output,ElementRef, ViewChild } from '@angular/core';
import { DataTreatService } from 'src/app/services/data-treat.service';
@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent {
 constructor(private DataTreatService:DataTreatService){}

 @ViewChild('targetElement') targetElement: ElementRef | undefined;
 @Input() cityData:any
 city:any={}
 cityName:any
 @Input() backupDAta :any
 @Input() showDetails:any 
 @Output() showDetailsChange: EventEmitter<boolean> = new EventEmitter<boolean>();
 myDate=new Date()
 DailyData:any
 thisCity:any={}
 direction = ['North','North East', 'East','South East', 'South','South West', 'West','North West']
  dataNow={
    weathercodeDaily:0,
    weathercodeHourly:0,
    time:"",
    humidity:"",
    temp:"",
    winddirec:"",
    windSpeed:"",
    temperature_2m_max:"",
    temperature_2m_min:""
  }
  ngOnInit(){
    this.updateCityData(this.cityData)
    this.updateCityName(this.backupDAta)
  }
/*   ngOnInit(){

   setTimeout(()=>{

     const city = localStorage.getItem('city')
   if( city ) {
     this.city=JSON.parse(city)
   }  
   
   this.thisCity= this.cityData
   console.log("thisCity",this.cityData)
   this.TempNowByHour()
   
   this.hourlyDetails(this.myDate.toISOString())
   },200)
   
    
      } */
    
hourlyDetails(startDate:any){
  startDate=startDate.split('T')[0]
  const url =`https://api.open-meteo.com/v1/forecast?latitude=${this.cityName.latitude}&longitude=${this.cityName.longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,windspeed_180m,winddirection_180m,windgusts_10m,uv_index,uv_index_clear_sky,is_day&forecast_days=1&start_date=${startDate}&end_date=${startDate}`
  this.DataTreatService.getWeatherData(url).subscribe(
    (response) => {
      this.DailyData=response
    },
    (error) => {
      console.error(error);
    }
  )
 
}
displ(){
  this.showDetails=!this.showDetails
  this.showDetailsChange.emit(this.showDetails);
  setTimeout(()=>{
    this.targetElement?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  },200)
}
 
  hourlyData=[]
 updateCityData(newCityData: any): void {
    this.city = newCityData;
    this.TempNowByHour()
  }
 
   updateCityName(newCityData: any): void {
    this.cityName = newCityData;
  } 
 
  TempNowByHour(){
    const currentHour = this.myDate;
    const index = this.cityData.hourly.time.findIndex((time: string | number | Date) => {
    const hour = new Date(time).getHours();
      return (hour === currentHour.getHours())
    });
    const dIndex = this.cityData.daily.time.findIndex((time: string | number | Date) => {
      const day = new Date(time).toISOString().split('T')[0];
        return (day === currentHour.toISOString().split('T')[0])
      });
    
    this.dataNow={
      weathercodeDaily:this.cityData.daily.weathercode[dIndex],
      weathercodeHourly:this.cityData.hourly.weathercode[index],
      time:this.cityData.hourly.time[index] ,
      humidity:this.cityData.hourly.relativehumidity_2m[index],
      temp:this.cityData.hourly.temperature_2m[index],
      winddirec:this.direction [Math.floor((( this.cityData.hourly.winddirection_180m[index]+22.5)%360)/45)],
      windSpeed:this.cityData.hourly.windspeed_180m[index],
      temperature_2m_max:this.cityData.daily.temperature_2m_max[dIndex],
      temperature_2m_min:this.cityData.daily.temperature_2m_min[dIndex]
    }
    

  }

  CloudObject :any = {
    0: { text: "No clouds observed", image: "./assets/images/fullsun-removebg.png" },
    1: { text: "Clearing sky", image: "./assets/images/fullsun-removebg.png" },
    2: { text: "Partly cloudy", image: "./assets/images/cloudy.png" },
    3: { text: "Cloudy", image: "./assets/images/nosun.png" },
    4: { text: "Reduced visibility due to smoke", image: "./assets/images/cloudy.png" },
    5: { text: "Haze", image: "./assets/images/cloudy.png" },
    6: { text: "Dust in the air", image: "./assets/images/cloudy.png" },
    7: { text: "Dust or sand raised by wind", image: "./assets/images/fullsun-removebg.png" },
    8: { text: "Dust whirl or sand whirl", image: "./assets/images/cloudy.png" },
    9: { text: "Duststorm or sandstorm", image: "./assets/images/fullsun-removebg.png" },
    10: { text: "Mist", image: "./assets/images/cloudy.png" },
    11: { text: "Fog or ice fog", image: "./assets/images/cloudy.png" },
    12: { text: "Continuous fog", image: "./assets/images/fullsun-removebg.png" },
    13: { text: "Visible lightning", image: "./assets/images/cloudy.png" },
    14: { text: "Precipitation in sight", image: "./assets/images/littleRain.png" },
    15: { text: "Precipitation reaching ground", image: "./assets/images/littleRain.png" },
    16: { text: "Precipitation near station", image: "./assets/images/littleRain.png" },
    17: { text: "Thunderstorm without precipitation", image: "./assets/images/littleRain.png" },
    18: { text: "Squalls", image: "./assets/images/fullsun-removebg.png" },
    19: { text: "Funnel cloud(s)", image: "./assets/images/fullsun-removebg.png" },
    20: { text: "Drizzle or snow grains", image: "./assets/images/cloudy.png" },
    21: { text: "Rain", image: "./assets/images/cloudy.png" },
    22: { text: "Snow", image: "./assets/images/cloudy.png" },
    23: { text: "Rain and snow or ice pellets", image: "./assets/images/cloudy.png" },
    24: { text: "Freezing drizzle or freezing rain", image: "./assets/images/cloudy.png" },
    25: { text: "Shower(s) of rain", image: "./assets/images/cloudy.png" },
    26: { text: "Shower(s) of snow or rain and snow", image: "./assets/images/cloudy.png" },
    27: { text: "Shower(s) of hail", image: "./assets/images/cloudy.png" },
    28: { text: "Fog or ice fog", image: "./assets/images/cloudy.png" },
    29: { text: "Thunderstorm", image: "./assets/images/cloudy.png" },
    30: { text: "Duststorm or sandstorm", image: "./assets/images/snow.png" },
    31: { text: "No change in duststorm or sandstorm", image: "./assets/images/snow.png" },
    32: { text: "Increase in duststorm or sandstorm", image: "./assets/images/snow.png" },
    33: { text: "Severe duststorm or sandstorm", image: "./assets/images/snow.png" },
    34: { text: "No change in duststorm or sandstorm", image: "./assets/images/snow.png" },
    35: { text: "Increase in duststorm or sandstorm", image: "./assets/images/snow.png" },
    36: { text: "Blowing snow (low)", image: "./assets/images/snow.png" },
    37: { text: "Heavy drifting snow", image: "./assets/images/snow.png" },
    38: { text: "Blowing snow (high)", image: "./assets/images/snow.png" },
    39: { text: "Heavy drifting snow", image: "./assets/images/snow.png" },
    40: { text: "Fog or ice fog in the distance", image: "./assets/images/nosun.png" },
    41: { text: "Fog or ice fog in patches", image: "./assets/images/nosun.png" },
    42: { text: "Thinning fog or ice fog", image: "./assets/images/nosun.png" },
    43: { text: "Thick fog or ice fog", image: "./assets/images/nosun.png" },
    44: { text: "No change in fog or ice fog", image: "./assets/images/nosun.png" },
    45: { text: "Thickening fog or ice fog", image: "./assets/images/nosun.png" },
    46: { text: "Rime depositing fog", image: "./assets/images/nosun.png" },
    47: { text: "Rime depositing fog", image: "./assets/images/nosun.png" },
    48: { text: "Fog depositing rime", image: "./assets/images/nosun.png" },
    49: { text: "Fog depositing rime", image: "./assets/images/nosun.png" },
    50: { text: "Drizzle (intermittent, slight)", image: "./assets/images/littleRain.png" },
    51: { text: "Drizzle (continuous)", image: "./assets/images/littleRain.png" },
    52: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/littleRain.png" },
    53: { text: "Drizzle (continuous)", image: "./assets/images/littleRain.png" },
    54: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/littleRain.png" },
    55: { text: "Drizzle (continuous)", image: "./assets/images/littleRain.png" },
    56: { text: "Drizzle (intermittent, slight)", image: "./assets/images/littleRain.png" },
    57: { text: "Drizzle (continuous)", image: "./assets/images/littleRain.png" },
    58: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/littleRain.png" },
    59: { text: "Drizzle (continuous)", image: "./assets/images/littleRain.png" },
    60: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rain.png" },
    61: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    62: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rain.png" },
    63: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    64: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/rain.png" },
    65: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    66: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rain.png" },
    67: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    68: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rain.png" },
    69: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    70: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/rain.png" },
    71: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    72: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rain.png" },
    73: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    74: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rain.png" },
    75: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    76: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/rain.png" },
    77: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    78: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rain.png" },
    79: { text: "Drizzle (continuous)", image: "./assets/images/rain.png" },
    80: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rainStorm.png" },
    81: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    82: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/rainStorm.png" },
    83: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    84: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rainStorm.png" },
    85: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    86: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rainStorm.png" },
    87: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    88: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/rainStorm.png" },
    89: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    90: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rainStorm.png" },
    91: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    92: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rainStorm.png" },
    93: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    94: { text: "Drizzle (intermittent, moderate)", image: "./assets/images/rainStorm.png" },
    95: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    96: { text: "Drizzle (intermittent, heavy)", image: "./assets/images/rainStorm.png" },
    97: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" },
    98: { text: "Drizzle (intermittent, slight)", image: "./assets/images/rainStorm.png" },
    99: { text: "Drizzle (continuous)", image: "./assets/images/rainStorm.png" }
  };

  setheight(button: any) {
    const btn = button as HTMLElement 
    btn.classList.toggle('full')
  }
  launch(e:any, date:any){
    const currentHour = this.myDate.getHours();
    const index = this.cityData.hourly.time.findIndex((time: string | number | Date) => {
    const hour = new Date(time).getHours();
      return (hour === currentHour)
    });
    this.dataNow={
      weathercodeDaily:this.cityData.daily.weathercode[e],
      weathercodeHourly:this.cityData.hourly.weathercode[e],
      time:this.cityData.hourly.time[e*24+index] ,
      humidity:this.cityData.hourly.relativehumidity_2m[e],
      temp:this.cityData.hourly.temperature_2m[e],
      winddirec:this.direction [Math.floor((( this.cityData.hourly.winddirection_180m[e]+22.5)%360)/45)],
      windSpeed:this.cityData.hourly.windspeed_180m[e],
       temperature_2m_max:this.cityData.daily.temperature_2m_max[e],
      temperature_2m_min:this.cityData.daily.temperature_2m_min[e] 
    }
    this.hourlyDetails(date)
   }
}

