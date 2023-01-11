import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Observable, switchMap} from "rxjs";
import {Router} from "@angular/router";

import {MovieService} from "../database/movie.service"; // data
import {IMovie} from "../models/movie"; // interface
import {IRating} from "../models/rating";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  movie$!: Observable<IMovie>;
  rating$!: Observable<IRating>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: MovieService
  ) {}

  ngOnInit(): void {
    this.movie$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getMovie(params.get('id')!))
    );

    this.rating$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getRating(params.get('id')!))
    );
  }

  // gotoMovies(movie: IMovie) {
  //   const movieId = movie ? movie.id : null;
  //   // Pass along the hero id if available
  //   // so that the HeroList component can select that hero.
  //   // Include a junk 'foo' property for fun.
  //   this.router.navigate(['/movies', { id: movieId, foo: 'foo' }]);
  // }
}
