import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {IMovie} from '../models/movie'; // interface
import {MessageService} from '../message.service'; // data
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {IRating} from "../models/rating";
import {IShow} from "../models/show";
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
export class MovieService {

  constructor(private messageService: MessageService, private http: HttpClient, private error: HttpErrorResponse) {
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
  // addMovie(movie: Movie): Observable<any> {
  //   this.messageService.add('MovieService: add movie');
  //   this.http.post<IMovie>('http://localhost:3000/api/movies/add', movie, httpOptions)
  //     .pipe(
  //       // catchError(this.handleError('addHero', movie))
  //     );
  // }

// ratings
  getRatings()
    :
    Observable<IRating[]> {
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/ratings');
  }

  getRating(id
              :
              number | string
  ) {
    return this.getRatings().pipe(
      // (+) before `id` turns the string into a number
      map((ratings: IRating[]) => ratings.find(rating => rating.movie_id === +id)!)
    );
  }

  getRatingsByMovieID(id
                        :
                        string
  ):
    Observable<IRating[]> {
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/' + id + '/ratings');
  }

  getShowsByMovieID(id: string
  ):
    Observable<IShow[]> {
    this.messageService.add('shows fetched');
    return this.http.get<IShow[]>('http://localhost:3000/api/shows//getshowid/' + id);
  }

  submit(theater
           :
           Theater
  ):
    Observable<ITheater> {
    this.messageService.add('submit theater object');
    return this.http.post<Theater>('http://localhost:3000/api/addTheater', theater)
    // .pipe(
    //   catchError(this.handleError('addTheater', theater))
    // );
  }

  handleError(error
                :
                Error | HttpErrorResponse
  ) {
    console.log('GlobalErrorHandlerService')
    // throw new Error(error, error);
  }
}
