import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getProductList():Observable<any> {
    return this.http.get(`https://stg-testdouble.quinnox.info/e55e3668-147b-4652-8870-9acd0205ea83-product-list`);
  }

  getMaxPrice(data:Array<any>) {
    return data.reduce((max, data)=>{
      return max > data.price ? max : data.price;
    }, 0);
  }
}
