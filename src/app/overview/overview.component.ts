import {Component, Input, OnInit} from '@angular/core';
import {IMovie, IOverview} from "../models/movie"; // import data
import {movies as movieData, overviews as moviesOverview} from "../database/movies";
import {IProduct} from "../models/products";
import {ProductsService} from "../database/products.service"; // for testing online database


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit{
  movie: IMovie[] = movieData
  overviews: IOverview[] = moviesOverview
  products: IProduct[] = [];
  @Input() overview: IOverview;

  // http
  constructor(private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.productsService.getAll().subscribe(products => {
      this.products = products;
      console.log(products);
    })
  }
}
