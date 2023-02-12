import {Component, ElementRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {IMovie, Movie} from "../models/movie";
import {IShow, Show} from "../models/show";
import {ITheatre, Theatre} from "../models/theatre";
import {MovieService} from "../database/movie.service";
import {ShowService} from "../database/show.service";
import {TheatreService} from "../database/theatre.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  // template: '<input #myInput type="button" value="Click me">'
})

export class AdminComponent implements OnInit {
  movie = new Movie(); // for post request
  show = new Show(); // for post request
  showtime = new Date();
  showdate = new Date();
  theatre = new Theatre(); // for post request
  //normal: number[] = [];
  compatibleTheaters: any[] = [];
  disabled: number[] = [];
  deluxe: number[] = [];
  toggleShow: boolean = true;
  toggleTheatre: boolean = true;
  selectedMovieID: number
  selectedShowID: number
  selectedTheatreID: number

  @Input() movie$: IMovie;
  @Input() show$: IShow;
  @Input() theatre$: ITheatre;

  movies$!: IMovie[];
  shows$!: IShow[];
  theatres$!: ITheatre[];

  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;
  @ViewChild('normalSeatSelector') normalSeatSelector: ElementRef;
  @ViewChild('deluxeSeatSelector') deluxeSeatSelector: ElementRef;
  @ViewChild('disabledSeatSelector') disabledSeatSelector: ElementRef;

  constructor(private elementRef: ElementRef,
              private injector: Injector,
              private movieService: MovieService,
              private showService: ShowService,
              private theaterService: TheatreService) {
  }

  ngOnInit(): void {
    this.refreshMoviesTable()
    // delay(1000)
    this.refreshShowsTable()
    // delay(1000)
    this.refreshTheatresTable()

  }

  selectID(id: number) {
    this.selectedMovieID = id;
    console.log(this.selectedMovieID)
  }

  toDateWithOutTimeZone(time: string) {
    let tempTime = time.split(":");
    let date = new Date();
    date.setHours(Number(tempTime[0]));
    date.setMinutes(Number(tempTime[1]));
    date.setSeconds(Number(tempTime[2]));
    return date;
  }

    toDateFromDisplayTimestamp(time: number) {
    let date = new Date();
    date.setTime(time);
    return date;
  }

  // getDataDiff(startDate: Date, endDate: Date) {
  //   const diff = endDate.getTime() - startDate.getTime();
  //   const days = Math.floor(diff / (60 * 60 * 24 * 1000));
  //   const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
  //   const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
  //   const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
  //   return { day: days, hour: hours, minute: minutes, second: seconds };
  // }

  getMovieNameByShowID(number: number, index: number): string | undefined {
    for (let i = 0; i < this.shows$.length; i++) {
      for (let j = 0; j < this.movies$.length; j++) {
        if (this.shows$[i].show_id === number && this.shows$[i].movie_id === this.movies$[j].movie_id) {
          // index 0 = movie name, index 1 = movie screentype, index 3 = movie sound type
          return index === 0 ? this.movies$[j].movie_name : (index === 1 ? this.movies$[j].screentype : this.movies$[j].soundtype)
        }
      }
    } return undefined;
  }

  // getShowEndByShowID(id: number) {
  //   for (let i = 0; i < this.shows$.length; i++) {
  //     for (let j = 0; j < this.movies$.length; j++) {
  //       if (this.shows$[i].show_id === id && this.shows$[i].movie_id === this.movies$[j].movie_id) {
  //         // return  this.movies$[i].movie_duration.valueOf()
  //         return new Date(this.toDateWithOutTimeZone(this.shows$[i].display_time).getTime() + (this.movies$[j].movie_duration * 60 * 1000))
  //       }
  //     }
  //   } return undefined;
  // }
  getShowEndByShowID(id: number) {
    for (let i = 0; i < this.shows$.length; i++) {
      for (let j = 0; j < this.movies$.length; j++) {
        if (this.shows$[i].show_id === id && this.shows$[i].movie_id === this.movies$[j].movie_id) {
          // return  this.movies$[i].movie_duration.valueOf()
          return new Date(this.toDateFromDisplayTimestamp(this.shows$[i].display_timestamp).getTime() + (this.movies$[j].movie_duration * 60 * 1000));
        }
      }
    } return undefined;
  }

  getTheatreNameByShowID(id: number): string | undefined {
      for (let i = 0; i < this.theatres$.length; i++) {
        if (this.theatres$[i].theater_id === id) {
          return this.theatres$[i].theater_name
      }
    } return undefined;
  }

  onCreateClick(rows: string, columns: string) {
    this.deluxe.splice(0, this.deluxe.length);
    this.disabled.splice(0, this.disabled.length);
    this.cinemaSeats.nativeElement.innerHTML = "";//delete old seats
    let rowNum = parseInt(rows);
    let colNum = parseInt(columns);

    for (let i = 0; i < rowNum; i++) {

      let row = document.createElement('div');

      for (let j = 1; j <= colNum; j++) {
        //this.normal.indexOf(j + i * colNum);
        let seat = document.createElement('div');
        seat.classList.add('seat');
        seat.innerHTML = (j + (i * colNum)) + "";
        seat.addEventListener('click', (event) => this.onSeatClick(event));
        row.appendChild(seat);
      }

      this.cinemaSeats.nativeElement.appendChild(row);
    }
  }

  Number(value: string) {
    return parseInt(value);
  }

  onSeatClick(event: Event) {
    console.log('Seat clicked');
    const target = event.target as HTMLElement;
    let num = parseInt(target.innerHTML);

    if (this.normalSeatSelector.nativeElement.checked) {
      if (this.disabled.includes(num)) {
        this.disabled.splice(this.disabled.indexOf(num), 1);
      }
      if (this.deluxe.includes(num)) {
        this.deluxe.splice(this.deluxe.indexOf(num), 1);
      }
      target.classList.add('seat');
      target.classList.remove('disabledSeat', 'deluxeSeat');
    } else if (this.deluxeSeatSelector.nativeElement.checked) {
      if (this.disabled.includes(num)) {
        this.disabled.splice(this.disabled.indexOf(num), 1);
      }
      this.deluxe.push(num);
      target.classList.add('deluxeSeat');
      target.classList.remove('disabledSeat', 'seat');
    } else if (this.disabledSeatSelector.nativeElement.checked) {
      if (this.deluxe.includes(num)) {
        this.deluxe.splice(this.deluxe.indexOf(num), 1);
      }
      this.disabled.push(num);
      target.classList.add('disabledSeat');
      target.classList.remove('deluxeSeat', 'seat');
    }
    //console.log("Normal: " + this.normal);
    console.log("Disabled: " + this.disabled);
    console.log("Deluxe: " + this.deluxe);
    console.log("Selected seat's number: " + num);
    // Perform any desired action
  }

  submitMovie() {
    this.movieService.addMovie(this.movie)
      .subscribe(data => {
          console.log(data)
          this.movie = data;
        }
      )
  }


  submitShow() {
    console.log(this.showtime);
    console.log(this.showdate);
    const displaytime = new Date(`${this.showdate} ${this.showtime}`);
    this.show.display_timestamp = (displaytime.getTime());
    this.showService.addShow(this.show)
      .subscribe(data => {
          this.refreshShowsTable()
        }
      )
  }

  submitTheatre() {
    this.theatre.deluxe = this.deluxe;
    this.theatre.disabled = this.disabled;
    this.theaterService.addTheatre(this.theatre)
      .subscribe(data => {
          this.refreshTheatresTable();
        }
      )
  }

  refreshMoviesTable() {
    this.movieService.getAllMovies()
      .subscribe(data => {
        // console.log(data)
        this.movies$ = data;
      })
  }

  refreshShowsTable() {
    this.showService.getShows()
      .subscribe(data => {
        // console.log(data)
        this.shows$ = data;
      })

  }

  refreshTheatresTable() {
    this.theaterService.getTheatres()
      .subscribe(data => {
        // console.log(data)
        this.theatres$ = data;
      })
  }



filterTheaters(movieId: number) {
  this.compatibleTheaters = this.theatres$.filter(theater => {
    // find the movie with the same id
    let movie;
    movie = this.movies$.find(m => m.movie_id === movieId);
    if (!movie) {
      return false;
    }
    // check if the theater has the same screentype or soundtype as the movie
    if((movie.screentype === "3D" && theater.screentype === "2D,3D") || movie.screentype === "2D"){
      if((movie.soundtype === "Dolby Atmos" && theater.soundtype === "Dolby Surround, ATMOS") || movie.soundtype === "Dolby Surround"){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  });
}

  toggleShows() {
    this.toggleShow = !this.toggleShow;
  }

  toggleTheatres() {
    this.toggleTheatre = !this.toggleTheatre;
  }

  onSelectedDeleteMovieID(value:number): void {
    this.selectedMovieID = value;
  }
  onSelectedDeleteShowID(value:number): void {
    this.selectedShowID = value;
  }
  onSelectedDeleteTheatreID(value:number): void {
    this.selectedTheatreID = value;
  }

  deleteMovie() {
    if (this.selectedMovieID !== -1 || this.selectedMovieID !== null) {
      this.movieService.deleteMovie(this.selectedMovieID)
        .subscribe(data => {
            console.log(data.await)
            this.selectedMovieID = data.await;
          }
        )
      this.selectedMovieID = -1
    } else {
      throw new Error("Selected movie ID has wrong value")
    }
  }

  deleteShow(id:number) {
    if(!id){
      return false;
    }
    this.showService.deleteShow(id)
      .subscribe(data => {
          this.refreshShowsTable();
          return true;
        }
      )
    this.selectedShowID = -1
    return false;
      
  }

  deleteTheatre(id:number) {
    if (isNaN(id)) {
      console.error('Invalid value');
      return;
    }
      this.theaterService.deleteTheatre(id)
        .subscribe(data => {
            this.refreshTheatresTable();
        });
      this.selectedTheatreID = -1
  }

}
