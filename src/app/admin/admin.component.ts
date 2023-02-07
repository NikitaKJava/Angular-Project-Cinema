import {Component, ElementRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {IMovie, Movie} from "../models/movie";
import {IShow, Show} from "../models/show";
import {ITheater, Theater} from "../models/theater";
import {MovieService} from "../database/movie.service";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  // template: '<input #myInput type="button" value="Click me">'
})


export class AdminComponent implements OnInit {
  movie = new Movie(); // for post request
  show = new Show(); // for post request
  theater = new Theater(); // for post request
  //normal: number[] = [];
  disabled: number[] = [];
  deluxe: number[] = [];
  toggleShow: boolean = true;
  toggleTheatre: boolean = true;

  @Input() movies: IMovie[];
  @Input() shows: IShow[];
  @Input() theatres: ITheater[];
  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;
  @ViewChild('normalSeatSelector') normalSeatSelector: ElementRef;
  @ViewChild('deluxeSeatSelector') deluxeSeatSelector: ElementRef;
  @ViewChild('disabledSeatSelector') disabledSeatSelector: ElementRef;

  constructor(private elementRef: ElementRef, private injector: Injector, private MovieService: MovieService) {
  }

  ngOnInit(): void {
    this.refreshMoviesTable()
    this.refreshShowsTable()
    this.refreshTheatresTable()
  }


  // ngAfterViewInit(rows: string, columns: string) {
  //
  //   // this.rowArray = 0;
  //   // this.colArray = 0;
  //
  //   // public ngAfterViewInit(rows: string, columns: string) {
  //   // }
  // }

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
    this.MovieService.addMovie(this.movie)
      .subscribe(data => {
          console.log(data)
          this.movie = data;
        }
      )
  }

  refreshMoviesTable() {
    this.MovieService.getMovies()
      .subscribe(data => {
        console.log(data)
        this.movies = data;
      })
  }

  refreshShowsTable() {
    this.MovieService.getShows()
      .subscribe(data => {
        console.log(data)
        this.shows = data;
      })
  }

  refreshTheatresTable() {
    this.MovieService.getTheatres()
      .subscribe(data => {
        console.log(data)
        this.theatres = data;
      })
  }

  submit() {
    let theater = new Theater();
    theater.deluxe = this.deluxe;
  }

  toggleShows() {
    this.toggleShow = !this.toggleShow;
  }

  toggleTheatres() {
    this.toggleTheatre = !this.toggleTheatre;
  }
}
