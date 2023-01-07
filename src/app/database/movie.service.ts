import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IMovie } from '../models/movie';
import { movies } from './movies';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(private messageService: MessageService) { }

  getMovies(): Observable<IMovie[]> {
    // TODO: send the message _after_ fetching the movies
    this.messageService.add('MovieService: fetched movies');
    return of(movies);
  }

  getMovie(id: number | string) {
    return this.getMovies().pipe(
      // (+) before `id` turns the string into a number
      map((movies: IMovie[]) => movies.find(movie => movie.id === +id)!)
    );
  }
}
