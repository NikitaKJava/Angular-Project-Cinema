import {Injectable} from '@angular/core';

import {catchError, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {IMovie} from '../models/movie'; // interface
import {MessageService} from '../message.service'; // data
import {HttpClient} from "@angular/common/http";
import {IRating} from "../models/rating";
import {Theater} from "../models/theater";

class httpOptions {
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(private messageService: MessageService, private http: HttpClient, private options: httpOptions) {
  }

  getMovies(): Observable<IMovie[]> {
    // // TODO: send the message _after_ fetching the movies
    this.messageService.add('MovieService: fetched movies');
    return this.http.get<IMovie[]>('http://localhost:3000/api/movies/getall');
  }

  getMovie(id: number | string) {
    return this.getMovies().pipe(
      // (+) before `id` turns the string into a number
      map((movies: IMovie[]) => movies.find(movie => movie.movie_id === +id)!)
    );
  }

  // ratings
  getRatings(): Observable<IRating[]> {
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/ratings');
  }

  getRating(id: number | string) {
    return this.getRatings().pipe(
      // (+) before `id` turns the string into a number
      map((ratings: IRating[]) => ratings.find(rating => rating.movie_id === +id)!)
    );
  }

  getRatingsByMovieID(id: number): Observable<IRating[]> {
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/' + id + '/ratings');
  }

  submit(theater: Theater) {
    this.http.post<Theater>('http://localhost:3000/api/addTheater', theater, this.options)
      // .pipe(
      //   catchError(this.handleError('addHero', theater))
      // );
  }

  // private handleError(addHero: string, theater: Theater)  Observable<ITheater[]> {
  //   console.log()
  //   return function (p1: any, p2: Observable<Theater>) {
  //   };
  // }
}
