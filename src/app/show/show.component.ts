import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Observable, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../login/auth.service";
import {MovieService} from "../database/movie.service"; // data
import {IMovie, WatchStatus} from '../models/movie'; // interface, class
import {IRating, NewRating} from "../models/rating";
import {IShow, Show} from "../models/show";
import {ShowService} from "../database/show.service";
import {RatingService} from "../database/rating.service";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  movie$!: Observable<IMovie>;
  movies$!: Observable<IMovie[]>;
  ratings$!: Observable<IRating[]>;
  shows$!: Observable<Show[]>;
  // rating$!: Observable<IRating>;
  @Input() rating: IRating;
  @Input() shows: IShow[];
  selectedID = 0;
  isLoggedIn:boolean;
  watchStatus: boolean;

  //dates
  today = new Date();
  tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  secondDate = new Date(new Date().setDate(new Date().getDate() + 2));
  thirdDate= new Date(new Date().setDate(new Date().getDate() + 3));
  fourthDate= new Date(new Date().setDate(new Date().getDate() + 4));
  fifthDate= new Date(new Date().setDate(new Date().getDate() + 5));
  sixDate = new Date(new Date().setDate(new Date().getDate() + 6));
  star: number;
  review: string;



  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private movieService: MovieService,
              private showService: ShowService,
              private ratingService: RatingService
  ) {
    authService.loggedInObservable.subscribe((newIsLoggedIn) => {
      this.isLoggedIn = newIsLoggedIn;
    });
  }

  get hasWatched(){
    return this.watchStatus;
  }
  checkHasWatched(id:number){
    return this.movieService.getWatchStatus(id);
  }

  ngOnInit(): void {
    this.movies$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedID = parseInt(params.get('id')!, 10);
        return this.movieService.getMovies();
      })
    );

    this.movie$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.movieService.getMovie(params.get('id')!))
    );

    this.ratings$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.ratingService.getRatingsByMovieID(params.get('id')!))
    );

    this.shows$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.showService.getCurrentShowsByMovieID(params.get('id')!))
    );

    console.log(this.shows$);
    console.log(this.ratings$);
    this.movieService.getWatchStatus(this.route.snapshot.params.id).subscribe(watched => {
        this.watchStatus = watched;
        console.log(this.watchStatus);
      });

  }

  toDateWithOutTimeZone(time: string) {
    // console.log("today: " + this.today)
    // console.log("tomorrow: " + this.tomorrow)
    console.log("second day: " + this.secondDate)
    // console.log("thord day: " + this.thirdDate)

    if(time === null){
      return null
    } else {
      let tempTime = time.split(":");
      let date = new Date();
      date.setHours(Number(tempTime[0]));
      date.setMinutes(Number(tempTime[1]));
      date.setSeconds(Number(tempTime[2]));
      console.log(date)
      return date.getDate();
    }
  }

  get isAuth(){
    return this.isLoggedIn;
  }



  addMovieRating(id: number){
    let r = new NewRating();
    r.movie_id = id;
    r.review = this.review;
    r.star = this.star;
    this.ratingService.addRating(r).subscribe(() => {
      this.ratings$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.ratingService.getRatingsByMovieID(params.get('id')!))
      );
    });
  }

  toDateFromDisplayTimestamp(time: number) {
    let date = new Date();
    date.setTime(time);
    return date;
  }

  // gotoMovies(movie: IMovie) {
  //   const movieId = movie ? movie.id : null;
  //   // Pass along the hero id if available
  //   // so that the HeroList component can select that hero.
  //   // Include a junk 'foo' property for fun.
  //   this.router.navigate(['/movies', { id: movieId, foo: 'foo' }]);
  // }
}
