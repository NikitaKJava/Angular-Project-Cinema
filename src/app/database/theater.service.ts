import {Injectable} from '@angular/core';

import {catchError, Observable} from 'rxjs';

import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ITheater, Theater} from "../models/theater";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})
export class TheaterService {
  constructor(private messageService: MessageService, private http: HttpClient) {
  }

  /** GET: get all theatres from the database */
  getTheatres(): Observable<ITheater[]> {
    this.messageService.add('shows fetched');
    return this.http.get<ITheater[]>('http://localhost:3000/api/theather/')
  }

  /** POST: add a new theater to the database */
  addTheater(theater: Theater): Observable<any> {
    this.messageService.add('submit theater object');
    return this.http.post<Theater>('http://localhost:3000/api/addTheater', theater, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD THEATER ERROR: " + err);
        })
      )
  }
}
