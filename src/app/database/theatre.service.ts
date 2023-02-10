import {Injectable} from '@angular/core';

import {catchError, Observable} from 'rxjs';

import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ITheatre, Theatre} from "../models/theatre";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})
export class TheatreService {
  constructor(private messageService: MessageService, private http: HttpClient) {
  }

  /** GET: get all theatres from the database */
  getTheatres(): Observable<ITheatre[]> {
    this.messageService.add('shows fetched');
    return this.http.get<ITheatre[]>('http://localhost:3000/api/theatre/')
  }

  /** POST: add a new theatre to the database */
  addTheatre(theatre: Theatre): Observable<any> {
    this.messageService.add('MovieService: add theatre');
    const body = JSON.stringify(theatre);
    return this.http.post<Theatre>('http://localhost:3000/api/theatre/add', body, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD THEATER ERROR: " + err);
        })
      )
  }

  /** DELETE: delete a selected theatre by ID from database */
  deleteTheatre(id: number): Observable<any> {
    this.messageService.add('TheatreService: delete theatre');
    const body = JSON.stringify(id);
    // console.log(body)
    return this.http.post<ITheatre>('http://localhost:3000/api/theatre/delete/:' + id, body, httpOptions)
      .pipe(
        catchError(err => {
          return ("DELETE THEATRE ERROR: " + err);
        })
      );
  }
}
