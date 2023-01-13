import {Component, ComponentFactoryResolver, Injector, Input} from '@angular/core';
import {IMovie} from "../models/movie";
import { AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ITheater} from "../models/theater"


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  // template: '<input #myInput type="button" value="Click me">'
})


export class AdminComponent {
  rowArray = 5
  colArray = 5
  seat_rows: number[] = [this.rowArray]
  seat_columns: number[] = [this.colArray]

  // @ViewChild('rowsInput') sr: number = 0
  // @ViewChild('columnsInput') sc: ElementRef
  @Input() movies: IMovie;
  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;

  constructor(private elementRef:ElementRef,private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver){}


  public ngAfterViewInit(rows: string, columns: string) {

    this.rowArray = Number(rows);
    this.colArray = Number(columns);
    // this.sr.nativeElement.addEventListener('click', () => {
    //   console.log('Button clicked');
    // });

    console.log(this.seat_rows, " ", this.seat_columns);
    for (let i = 0; i < parseInt(rows); i++) {
      let row = document.createElement('div');
      for (let j = 1; j <= parseInt(columns); j++) {
        let seat = document.createElement('div');
        seat.classList.add('seat');
        seat.innerHTML = (j+i*parseInt(columns))+"";
        seat.addEventListener('click', (event) => this.onSeatClick(event));
        row.appendChild(seat);
      }
      this.cinemaSeats.nativeElement.appendChild(row);
    }


    const factory = this.componentFactoryResolver.resolveComponentFactory(AdminComponent);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();

    // console.log(this.seat_rows, " ", this.seat_columns)
    // console.log(this.rowArray, " ", this.colArray)
  }

  Number(value: string){
    return parseInt(value);
  }

  onSeatClick(event: Event) {
    console.log('Seat clicked');
    console.log(event.target)
    // Perform any desired action
  }
}
