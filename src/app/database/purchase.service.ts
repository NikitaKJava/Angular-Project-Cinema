import {catchError, Observable} from "rxjs";
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core"; // interface

import {IShow, Show} from "../models/show";
import {IPurchase, Purchase} from "../models/purchase"; // interface, class
import { ITicket } from "../models/ticket";

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
  addPurchase(purchases: Purchase[]): Observable<any> {
    this.messageService.add('PurchaseService: add show');
    const body = JSON.stringify(purchases);
    console.log(body)
    return this.http.post<Purchase[]>('http://localhost:3000/api/ticketing/buyticket', body, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD PURCHASE ERROR: " + err);
        })
      )
  }

  /** GET: get a specific purchase by show ID from the database */
  getPurchasesByShowID(id: number): Observable<ITicket[]> {
    this.messageService.add('PurchaseService: shows fetched');
    return this.http.get<ITicket[]>('http://localhost:3000/api/ticketing/ticketsinfo/show/' + id);
  }
 /** GET ALL: get a specific purchase by show ID from the database */
  getAllPurchasesByShowID(id: number): Observable<ITicket[]> {
    this.messageService.add('PurchaseService: shows fetched');
    return this.http.get<ITicket[]>('http://localhost:3000/api/ticketing/allticketsinfo/show/' + id);
  }
    /** GET: get a specific purchase by show ID from the database */
  getPurchasesByTicketID(id: number): Observable<ITicket[]> {
    this.messageService.add('PurchaseService: shows fetched');
    return this.http.get<ITicket[]>('http://localhost:3000/api/ticketing/ticketsinfo/' + id);
  }

  /** DELETE: delete a selected ticket by ID from database */
  deleteTicket(id: number): Observable<any> {
    this.messageService.add('PurchaseService: delete ticket');
    return this.http.delete<IPurchase>('http://localhost:3000/api/ticketing/ticket/' + id, httpOptions)
      .pipe(
        catchError(async () => console.log("DELETE PURCHASE ERROR"))
      );
  }
}
