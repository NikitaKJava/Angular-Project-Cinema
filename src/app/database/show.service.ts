import {catchError, Observable} from "rxjs";
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core"; // interface

import {IShow, Show} from "../models/show"; // interface, class

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
    this.messageService.add('ShowService: add show');
    // let time = new Date(); // movie start
    // console.log(time)
    const body = JSON.stringify(show);
    console.log(body)
    return this.http.post<Show>('http://localhost:3000/api/show/add', body, httpOptions)
      .pipe(
        catchError(async () => console.log("ADD SHOW ERROR"))
      );
  }

  /** GET: get a specific shows by movie ID from the database */
  getShowsByMovieID(id: string): Observable<IShow[]> {
    this.messageService.add('ShowService: shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/show/getbymovie/' + id);
  }

  /** GET: get a specific shows by movie ID from the database */
  getCurrentShowsByMovieID(id: string): Observable<Show[]> {
    this.messageService.add('ShowService: shows fetched');
    return this.http.get<Show[]>('http://localhost:3000/api/show/getcurrentbymovie/' + id);
  }

  /** GET: get all shows from the database */
  getShows(): Observable<IShow[]> {
    this.messageService.add('ShowService: shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/show/');
  }

  /** DELETE: delete a selected show by ID from database */
  deleteShow(id: number): Observable<any> {
    this.messageService.add('ShowService: delete show');
    return this.http.delete<IShow>('http://localhost:3000/api/show/' + id, httpOptions)
      .pipe(
        catchError(err => {
          return ("DELETE SHOW ERROR: " + err);
        })
      );
  }
}
