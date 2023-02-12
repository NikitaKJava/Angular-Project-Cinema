import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Purchase } from '../models/purchase';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import {PurchaseService} from "../database/purchase.service";
import {TheatreService} from "../database/theatre.service";
import {AuthService} from "../login/auth.service";
import { TheatreSeats } from 'src/app/models/theatre';



@Component({
  selector: 'app-show-booking',
  templateUrl: './show-booking.component.html',
  styleUrls: ['./show-booking.component.css']
})
export class ShowBookingComponent implements OnInit {
  isLoggedIn:boolean;
  puchases:Purchase[];
  tickets:number[][] = [];
  movieId:number;
  showId:number;
  totalPrice:number;
  seats: TheatreSeats;
  
  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;
  @ViewChild('normalSeatSelector') normalSeatSelector: ElementRef;
  @ViewChild('deluxeSeatSelector') deluxeSeatSelector: ElementRef;
  @ViewChild('disabledSeatSelector') disabledSeatSelector: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
              private ticketService:PurchaseService,
              private theaterService:TheatreService,
              private authService: AuthService) {

     authService.loggedInObservable.subscribe((newIsLoggedIn) => {
      this.isLoggedIn = newIsLoggedIn;
    });
  }
  
  ngOnInit() {
    this.movieId = this.activatedRoute.snapshot.params.id;
    this.showId = this.activatedRoute.snapshot.params.bookingId;
    this.theaterService.getTheatreSeatsByShowID(this.showId).subscribe(seats => {
        this.seats = seats;
        this.createTheathere();
      });
  }
  createTheathere() {

    this.cinemaSeats.nativeElement.innerHTML = "";//delete old seats
    let rowNum = (this.seats.seat_rows);
    let colNum = (this.seats.seat_columns);

    for (let i = 0; i < rowNum; i++) {

      let row = document.createElement('div');

      for (let j = 1; j <= colNum; j++) {
        //this.normal.indexOf(j + i * colNum);
        let seat = document.createElement('div');
        
        let seatNumber = j + (i * colNum);
        seat.innerHTML = (seatNumber) + "";
        let price = 0;
        //The some() method tests whether at least one element in the array passes the test implemented by the provided function. 
        if(this.seats.inactive.includes(seatNumber)){
          seat.classList.add('seat');
          seat.id = "inactive"
        }else if(this.seats.normal.some(seatIdx => {price = seatIdx[1]; return seatIdx[0] === seatNumber})){
          console.log(price+"€");
          seat.setAttribute('price', price+"");
          seat.classList.add('seat');
          seat.addEventListener('click', (event) => this.onSeatClick(event));
        }else if(this.seats.deluxe.some(seatIdx => {price = seatIdx[1]; return seatIdx[0] === seatNumber})){
          console.log(price+"€");
          seat.setAttribute('price', price+"");
          seat.classList.add('deluxeSeat');
          seat.addEventListener('click', (event) => this.onSeatClick(event));
        }else if(this.seats.disabled.some(seatIdx => {price = seatIdx[1]; return seatIdx[0] === seatNumber})){
          console.log(price+"€");
          seat.setAttribute('price', price+"");
          seat.classList.add('disabledSeat');
          seat.addEventListener('click', (event) => this.onSeatClick(event));
        }
        row.appendChild(seat);
      }

      this.cinemaSeats.nativeElement.appendChild(row);
    }
  }

  onPucheaseClick(event: Event){

  }

  onSeatClick(event: Event) {
    console.log('Seat clicked');
    const target = event.target as HTMLElement;
    let num = parseInt(target.innerHTML);
    let temp = target.getAttribute('price');

    if (num !== null && temp !== null) {
      let price = parseInt(temp);
      console.log(price);
      if(target.id === "selected"){
        this.totalPrice = this.totalPrice - price;
        target.id = "";
        this.tickets = this.tickets.filter(ticket => !(ticket[0] === num && ticket[1] === price));
      }else{
        this.totalPrice = this.totalPrice + (price);
        target.id = "selected";
        this.tickets.push([num, (price)]);
      }
    }
    
    //console.log("Normal: " + this.normal);
    // Perform any desired action
  }

  get isAuth(){
    return this.isLoggedIn;
  }

  toDateFromDisplayTimestamp(time: number) {
    let date = new Date();
    date.setTime(time);
    return date;
  }

}
