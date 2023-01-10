import {Component, Input, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

// import {overviews as moviesOverview} from "../database/movies";

import {MovieService} from "../database/movie.service";
import {IMovie, IOverview} from "../models/movie";

@Component({
  selector: 'app-overview-element',
  templateUrl: './overview-element.component.html',
  styleUrls: ['./overview-element.component.css']
})

export class OverviewElementComponent implements OnInit {
  movies$!: Observable<IMovie[]>;
  selectedId = 0;
  @Input() movie: IMovie;

  // overviews: IOverview[] = moviesOverview
// products: IProduct[] = [];
//   @Input() overview: IOverview;
//   @Input() movie: IMovie;

// http
// constructor(private productsService: ProductsService) {
// }

  constructor(private route: ActivatedRoute, private MovieService: MovieService) {}

  ngOnInit(): void {
    // this.productsService.getAll().subscribe(products => {
    //   this.products = products;
    //   console.log(products);
    // })

    this.movies$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = parseInt(params.get('id')!, 10);
        return this.MovieService.getMovies();
      })
    );
  }
}
