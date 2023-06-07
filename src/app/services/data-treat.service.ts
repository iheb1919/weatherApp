import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTreatService {
  constructor(private http:HttpClient){
   
  }
  loader:boolean=false
  getWeatherData(apiUrl: string): Observable<any> {
   return this.http.get<any>(apiUrl);
  }
  

}
