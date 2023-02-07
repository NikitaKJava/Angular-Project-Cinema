import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {IMovie, Movie} from '../models/movie'; // interface, class
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {IRating} from "../models/rating"; // interface
import {IShow} from "../models/show"; // interface
import {ITheater, Theater} from "../models/theater";
import * as https from "https"; // interface, class

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(private messageService: MessageService, private http: HttpClient) {
  }

  getMovies(): Observable<IMovie[]> {
    // // TODO: send the message _after_ fetching the movies
    this.messageService.add('MovieService: fetched movies');
    return this.http.get<IMovie[]>('http://localhost:3000/api/movies/getall');
  }

  /** GET: add a new movie to the database */
  getMovie(id: number | string) {
    return this.getMovies().pipe(
      // (+) before `id` turns the string into a number
      map((movies: IMovie[]) => movies.find(movie => movie.movie_id === +id)!)
    );
  }

  /** POST: add a new movie to the database */
  addMovie(movie: Movie): Observable<any> {
    this.messageService.add('MovieService: add movie');
    const body = JSON.stringify(movie);
    console.log(body)
    return this.http.post<IMovie>('http://localhost:3000/api/movies/add', body, httpOptions)
      .pipe(
        // catchError(this.handleError('addHero', movie))
      );
  }

  /** GET: get all ratings the database */
  getRatings(): Observable<IRating[]> {
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/ratings');
  }

  /** GET: get a specific rating by ID from the database */
  getRating(id: number | string) {
    return this.getRatings().pipe(
      // (+) before `id` turns the string into a number
      map((ratings: IRating[]) => ratings.find(rating => rating.movie_id === +id)!)
    );
  }

  /** GET: get a specific rating by movie ID from the database */
  getRatingsByMovieID(id: string): Observable<IRating[]> {
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/' + id + '/ratings');
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
  /** GET: get all theatres from the database */
  getTheatres(): Observable<ITheater[]> {
    this.messageService.add('shows fetched');
    return this.http.get<ITheater[]>('http://localhost:3000/api/theather/');
  }

  addTheater(theater: Theater): Observable<any> {
    this.messageService.add('submit theater object');
    return this.http.post<Theater>('http://localhost:3000/api/addTheater', theater)
    // .pipe(
    //   catchError(this.handleError('addTheater', theater))
    // );
  }

  // handleError(error: Error | HttpErrorResponse) {
  //   console.log('GlobalErrorHandlerService' + error)
  //   // throw new Error(error, error);
  // }
}
