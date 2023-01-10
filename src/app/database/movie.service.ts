import { Injectable } from '@angular/core';

import {delay, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { IMovie } from '../models/movie'; // interface
import { movies } from './movies'; // data
import { MessageService } from '../message.service';
import {IProduct} from "../models/products";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getMovies(): Observable<IMovie[]> {
    // // TODO: send the message _after_ fetching the movies
    // this.messageService.add('MovieService: fetched movies');
    // return of(movies);

    return this.http.get<IMovie[]>('https://fakestoreapi.com/products', {
      // params: new HttpParams().append('limit', 5) // 5 items from json
      params: new HttpParams({ // loading 5 items
        fromObject: {limit: 5}
      })
    }).pipe(
      delay(2000)
    )
  }

  getMovie(id: number | string) {
    return this.getMovies().pipe(
      // (+) before `id` turns the string into a number
      map((movies: IMovie[]) => movies.find(movie => movie.movie_id === +id)!)
    );
  }
}
