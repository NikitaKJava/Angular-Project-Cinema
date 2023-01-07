import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {delay, Observable} from "rxjs";
import {IProduct} from "../models/products";

// sample sample sample
@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  constructor(private http: HttpClient) {

  }

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>('https://fakestoreapi.com/products', {
      // params: new HttpParams().append('limit', 5) // 5 items from json
      params: new HttpParams({ // loading 5 items
        fromObject: {limit: 5}
      })
    }).pipe(
      delay(2000)
    )
  }
}
