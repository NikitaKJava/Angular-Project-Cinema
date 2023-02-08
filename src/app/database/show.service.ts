import {catchError, Observable} from "rxjs";
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {IShow, Show} from "../models/show";
import {IMovie} from "../models/movie";
import {Injectable, OnInit} from "@angular/core"; // interface

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})

export class ShowService {

  constructor(private messageService: MessageService, private http: HttpClient) {}

  /** POST: add a new show to the database */
  addShow(show: Show): Observable<any> {
    this.messageService.add('MovieService: add movie');
    const body = JSON.stringify(show);
    console.log(body)
    return this.http.post<IMovie>('http://localhost:3000/api/show/add', body, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD THEATER ERROR: " + err);
        })
      )
  }

  /** GET: get a specific shows by movie ID from the database */
  getShowsByMovieID(id: string): Observable<IShow[]> {
    this.messageService.add('shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/shows//getshowid/' + id);
  }

  /** GET: get all shows from the database */
  getShows(): Observable<IShow[]> {
    this.messageService.add('shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/show/');
  }
}
