import {Injectable} from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {MessageService} from '../message.service'; // data
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IRating, Rating, NewRating} from "../models/rating";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private messageService: MessageService, private http: HttpClient) {
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

  /** POST: add a new rating to the database */
  addRating(rating: NewRating): Observable<any> {
    this.messageService.add('submit theater object');
    return this.http.post<Rating>('http://localhost:3000/api/movies/rating/add', rating, httpOptions)
      .pipe(
        catchError(err => {
          return ("ADD RATING ERROR: " + err);
        })
      )
  }
}
