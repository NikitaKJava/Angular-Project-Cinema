import {Component, Input, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs"; // for testing online database
import {ActivatedRoute} from "@angular/router";

import {overviews as moviesOverview} from "../database/movies";

import {MovieService} from "../database/movie.service";
import {IMovie, IOverview} from "../models/movie"; // import data

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {
  movies$!: Observable<IMovie[]>;
  overviews: IOverview[] = moviesOverview
// products: IProduct[] = [];
  @Input() overview: IOverview;
  selectedId = 0;

// http
// constructor(private productsService: ProductsService) {
// }

  constructor(
    private route: ActivatedRoute,
    private service: MovieService
  ) {
  }


  ngOnInit(): void {
    // this.productsService.getAll().subscribe(products => {
    //   this.products = products;
    //   console.log(products);
    // })

    this.movies$ = this.route.paramMap.pipe(
      switchMap(params => {
          this.selectedId = parseInt(params.get('id')!, 10);
          return this.service.getMovies();
        })
      );
  }
}

