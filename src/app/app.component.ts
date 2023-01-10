import {Component, OnInit} from '@angular/core';
import {IMovie, IOverview} from "./models/movie"; // import interface
import {movies as movieData} from "./database/movies"; // import data
import {ProductsService} from "./database/products.service";
import {IProduct} from "./models/products";
import {MovieService} from "./database/movie.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ng-Cinema';
  toggle = true;

  // movie: IMovie[] = movieData
  movies: IMovie[] = []
  // overviews: IOverview[] = moviesOverview
  // products: IProduct[] = [];
  loading = false

  // constructor(private productsService: ProductsService) {}

  constructor(private service: MovieService) {}

  toggleCards() {
    this.toggle = !this.toggle;
  }

  ngOnInit(): void {
    // document.body.classList.add('bg-img');
    this.loading = true;
    // this.productsService.getAll().subscribe(products => {
    //   this.products = products;
    // })

    this.service.getMovies().subscribe(movies => {
      this.movies = movies;
    })

    this.loading = false;
  }
}
