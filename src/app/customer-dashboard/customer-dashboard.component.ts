import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import {PurchaseService} from "../database/purchase.service";
import { DatePipe } from '@angular/common';
import { Ticket } from 'src/app/models/ticket';
import {AuthService} from "../login/auth.service";

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})

export class CustomerDashboardComponent implements OnInit{

  ticket:Ticket[];

  constructor(private activatedRoute: ActivatedRoute,
              private ticketService:PurchaseService,
              private authService: AuthService) {

     this.ticketService.getPurchases().subscribe(ticket => {
       this.ticket = ticket;
     })

  }

  ngOnInit(): void {
  }

  getCurrentDate(){
    return Date.now();
  }
  username(): string{
    return this.authService.username;
  }

  toDateFromDisplayTimestamp(time: number) {
    let date = new Date();
    date.setTime(time);
    return date;
  }
  
  returnTicket(ticketItem:Ticket){
    this.ticketService.deleteTicket(ticketItem.ticket_id)
    .subscribe(() => {
      this.ticketService.getPurchases().subscribe(ticket => {
        this.ticket = ticket;
      });
    });
  }
}
