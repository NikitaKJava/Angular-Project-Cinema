import {catchError, Observable} from "rxjs";
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core"; // interface

import {IShow, Show} from "../models/show";
import {IPurchase, Purchase} from "../models/purchase"; // interface, class

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})

export class PurchaseService {

  constructor(private messageService: MessageService, private http: HttpClient) {}

  /** POST: add a new purchase to the database */
  addPurchase(purchases: IPurchase[]): Observable<any> {
    this.messageService.add('PurchaseService: add show');
    const body = JSON.stringify(purchases);
    console.log(body)
    return this.http.post<Purchase[]>('http://localhost:3000/api/ticketing/buyTicket', body, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD PURCHASE ERROR: " + err);
        })
      )
  }

  /** GET: get a specific purchase by show ID from the database */
  getPurchasesByShowID(id: string): Observable<IPurchase[]> {
    this.messageService.add('PurchaseService: shows fetched');
    return this.http.get<IPurchase[]>('http://localhost:3000/api/show/' + id + '/purchases');
  }

  /** GET: get all shows from the database */
  getShows(): Observable<IPurchase[]> {
    this.messageService.add('PurchaseService: shows fetched');
    return this.http.get<IPurchase[]>('http://localhost:3000/api/show/');
  }

  /** DELETE: delete a selected show by ID from database */
  deleteShow(id: number): Observable<any> {
    this.messageService.add('PurchaseService: delete show');
    const body = JSON.stringify(id);
    console.log(body)
    return this.http.post<IPurchase>('http://localhost:3000/api/show/' + id + '/purchase/id', body, httpOptions)
      .pipe(
        catchError(async () => console.log("DELETE PURCHASE ERROR"))
      );
  }
}
