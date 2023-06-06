import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTreatService {

  

  getWeatherData(apiUrl: string): Observable<any> {
    //const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&timezone=Africa%2FCairo`;
    //const apiUrl=`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&timezone=Europe%2FLondon`
    //const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,windspeed_180m,winddirection_180m&forecast_days=1&timezone=Europe%2FLondon&daily=temperature_2m_max,temperature_2m_min`
    //const apiUrl=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover,windspeed_180m,winddirection_180m&daily=temperature_2m_max,temperature_2m_min,uv_index_clear_sky_max&timezone=Europe%2FLondon`
  
    return this.http.get<any>(apiUrl);
  }

  constructor(private http:HttpClient){
   
  }
}
