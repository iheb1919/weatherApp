import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTreatService {
  constructor(private http:HttpClient){}
  loader:boolean=false
  getWeatherData(apiUrl: string): Observable<any> {
   return this.http.get<any>(apiUrl);
  }
  
   getLocationDetails(location: { [key: string]: any }): string {
    const { name, country, admin1, admin2, admin3 } = location;
    console.log(location)
    // Create an array of the properties
    const properties: (string | undefined)[] = [name, admin1, admin2, admin3, country];
  
    // Filter out undefined properties and join with a comma separator
    let result = properties.filter(Boolean).join(", ");
    if (result.length==0) result=" Place UNKNOWN ???"
  
    return result;
  }
  
}
