import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Purchase } from '../models/purchase';
import { ActivatedRoute, Router } from '@angular/router';
import {PurchaseService} from "../database/purchase.service";
import {TheatreService} from "../database/theatre.service";
import {AuthService} from "../login/auth.service";
import { TheatreSeats } from 'src/app/models/theatre';
import {of} from "rxjs";
import {IPayPalConfig, ICreateOrderRequest} from "ngx-paypal";

@Component({
  selector: 'app-show-booking',
  templateUrl: './show-booking.component.html',
  styleUrls: ['./show-booking.component.css']
})

export class ShowBookingComponent implements OnInit {
  isLoggedIn:boolean;
  isAdmin:boolean;
  purchases:Purchase[] = [];
  tickets:number[][] = [];
  movieId:number;
  showId:number;
  orderId:string = "";
  totalPrice:number = 0;
  seats: TheatreSeats;

  public payPalConfig?: IPayPalConfig;

  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;
  @ViewChild('normalSeatSelector') normalSeatSelector: ElementRef;
  @ViewChild('deluxeSeatSelector') deluxeSeatSelector: ElementRef;
  @ViewChild('disabledSeatSelector') disabledSeatSelector: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
              private ticketService:PurchaseService,
              private theaterService:TheatreService,
              private authService: AuthService,
              private router: Router) {

     authService.loggedInObservable.subscribe((newIsLoggedIn) => {
      this.isLoggedIn = newIsLoggedIn;
      this.purchases = [];
    });
    authService.isAdminRoleObservable.subscribe((newisAdmin) => {
      this.isAdmin = newisAdmin;
    });
  }

  get getTickets(){
    return of(this.tickets);
  }
  get isAdminCheck(){
    return this.isAdmin;
  }
  ngOnInit() {

    this.initConfig();

    this.movieId = parseInt(this.activatedRoute.snapshot.params.id);
    this.showId = parseInt(this.activatedRoute.snapshot.params.bookingId);
    this.theaterService.getTheatreSeatsByShowID(this.showId).subscribe(seats => {
        this.seats = seats;
        this.createTheatre();
      });
  }
  refreshTheatre() {
    this.theaterService.getTheatreSeatsByShowID(this.showId).subscribe(seats => {
        this.seats = seats;
        this.createTheatre();
      });
  }
  createTheatre() {

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
        //Some() method tests whether at least one element in the array passes the test implemented by the provided function.
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

  onPurchaseClick(){
    this.ticketService.addAdminPurchase(this.purchases).subscribe(() => {
        this.tickets = [];
        this.purchases = [];
        this.totalPrice = 0;
        this.router.navigate(['/dashboard']).then(() => console.log("addPurchase OK"));
      },
      error => {
        console.error(error);
        this.cancelRoutine();
      }
    );
  }
  async onPurchaseViaPayPal(): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(this.purchases);
    this.ticketService.addPurchase(this.purchases).subscribe(
      order => {
        resolve(order.id);
      },
      error => {
        this.cancelRoutine();
        reject("invalid");
      }
    );
  });
}

  onValidateViaPayPal(order_id: any){
    if(typeof order_id === 'undefined'){
        this.cancelRoutine();
    }
    this.ticketService.validateorderPurchase(order_id).subscribe(order => {
        this.tickets = [];
        this.purchases = [];
        this.totalPrice = 0;
        this.router.navigate(['/dashboard']).then(() => console.log("addPurchase OK"));
      },
      error => {
        console.error(error);
        this.cancelRoutine();
      });
  }

  cancelRoutine(){
    this.tickets = [];
    this.purchases = [];
    this.totalPrice = 0;
    alert("Could not add tickets");
    this.refreshTheatre();
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

      // Clear the purchases array
      this.purchases = [];

      // Repopulate the purchases array based on the current contents of tickets
      for (let ticket of this.tickets) {
        let purchases = new Purchase();
        purchases.show_id = this.showId;
        purchases.seat_number = ticket[0];
        this.purchases.push(purchases);
      }
    }
  }

  get isAuth(){
    return this.isLoggedIn;
  }

  toDateFromDisplayTimestamp(time: number) {
    let date = new Date();
    date.setTime(time);
    return date;
  }

  private initConfig(): void {
      this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AYaW0nIl_mTeNzWQg5zpoP-0rLb6KDa9C4oO94XQ9BHeXSvSxBK1HNmnQ5Okrh6QEOjFyHwHnawbGzrT',
      createOrderOnClient:  () =>  <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: this.totalPrice.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.totalPrice.toString()
              }
            },
          },
        }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onClientAuthorization: async (data) => {
        console.log('onValidateViaPayPal', data);
        console.log(data.purchase_units[0].invoice_id);
        this.orderId = await this.onPurchaseViaPayPal();
        this.onValidateViaPayPal(this.orderId);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.cancelRoutine();
      },
      onError: err => {
        console.log('OnError', err);
        this.cancelRoutine();
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
