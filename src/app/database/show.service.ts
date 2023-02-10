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
    let time = new Date();
    const body = JSON.stringify(show);
    console.log(body)
    return this.http.post<IShow>('http://localhost:3000/api/show/add', body, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD SHOW ERROR: " + err);
        })
      )
  }

  /** GET: get a specific shows by movie ID from the database */
  getShowsByMovieID(id: string): Observable<IShow[]> {
    this.messageService.add('ShowService: shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/show/getshowid/' + id);
  }

  /** GET: get all shows from the database */
  getShows(): Observable<IShow[]> {
    this.messageService.add('ShowService: shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/show/');
  }

  /** DELETE: delete a selected show by ID from database */
  deleteShow(id: number): Observable<any> {
    this.messageService.add('ShowService: delete show');
    const body = JSON.stringify(id);
    console.log(body)
    return this.http.post<IShow>('http://localhost:3000/api/movies/delete/:' + id, body, httpOptions)
      .pipe(
        catchError(err => {
          return ("DELETE SHOW ERROR: " + err);
        })
      );
  }
}
