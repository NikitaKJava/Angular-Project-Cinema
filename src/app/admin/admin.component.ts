import {Component, ComponentFactoryResolver, ElementRef, Injector, Input, ViewChild} from '@angular/core';
import {IMovie} from "../models/movie";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  // template: '<input #myInput type="button" value="Click me">'
})


export class AdminComponent {
  disabled: number[] = new Array();
  deluxe: number[] = new Array();

  // @ViewChild('rowsInput') sr: number = 0
  // @ViewChild('columnsInput') sc: ElementRef
  @Input() movies: IMovie;
  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;
  @ViewChild('normalSeatSelector') normalSeatSelector: ElementRef;
  @ViewChild('deluxeSeatSelector') deluxeSeatSelector: ElementRef;
  @ViewChild('disabledSeatSelector') disabledSeatSelector: ElementRef;

  constructor(private elementRef: ElementRef, private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
  }


  ngAfterViewInit(rows: string, columns: string) {

    // this.rowArray = 0;
    // this.colArray = 0;

    // public ngAfterViewInit(rows: string, columns: string) {
    // }
  }

  onCreateClick(rows: string, columns: string) {
    for (let i = 0; i < parseInt(rows); i++) {
      let row = document.createElement('div');
      for (let j = 1; j <= parseInt(columns); j++) {
        let seat = document.createElement('div');
        seat.classList.add('seat');
        seat.innerHTML = (j + i * parseInt(columns)) + "";
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
    
    if(this.normalSeatSelector.nativeElement.checked === true){
      if(this.disabled.includes(num)){
        this.disabled.splice(this.disabled.indexOf(num),1);
      }
      if(this.deluxe.includes(num)){
        this.deluxe.splice(this.deluxe.indexOf(num),1);
      }
    }else if(this.deluxeSeatSelector.nativeElement.checked === true){
      if(this.disabled.includes(num)){
        this.disabled.splice(this.disabled.indexOf(num),1);
      }
      this.deluxe.push(num);
    }else if(this.disabledSeatSelector.nativeElement.checked === true){
      if(this.deluxe.includes(num)){
        this.deluxe.splice(this.deluxe.indexOf(num),1);
      }
      this.disabled.push(num);
    }
    console.log(this.disabled);
    console.log(this.deluxe);
    console.log(num);
    // Perform any desired action
  }
}


