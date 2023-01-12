import { Injectable } from '@angular/core';

import {delay, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { IMovie } from '../models/movie'; // interface
import { MessageService } from '../message.service'; // data
import {IProduct} from "../models/products";
import {HttpClient, HttpParams} from "@angular/common/http";
import {IRating} from "../models/rating";

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(private messageService: MessageService, private http: HttpClient) { }

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
  getRatings(): Observable<IRating[]>{
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/ratings/getall');
  }

  getRating(id: number | string) {
    return this.getRatings().pipe(
      // (+) before `id` turns the string into a number
      map((ratings: IRating[]) => ratings.find(rating => rating.movie_id === +id)!)
    );
  }

  getRatingsByMovieID(id: number ): Observable<IRating[]>{
    this.messageService.add('rating fetched');
    return this.http.get<IRating[]>('http://localhost:3000/api/movies/' + id + '/ratings');
  }
}
