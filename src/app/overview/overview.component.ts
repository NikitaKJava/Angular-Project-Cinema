import {Component, Input, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs"; // for testing online database
import {ActivatedRoute} from "@angular/router";

// import {movies as moviesOverview} from "../database/movies"; // todo replace with http requests

import {MovieService} from "../database/movie.service";
import {IMovie} from "../models/movie"; // import data

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {
  movies$!: Observable<IMovie[]>;
  selectedId = 0;
  @Input() movie: IMovie;

  // overviews: IOverview[] = moviesOverview
// products: IProduct[] = [];


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
