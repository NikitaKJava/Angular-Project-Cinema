import {Component, ComponentFactoryResolver, ElementRef, Injector, Input, ViewChild} from '@angular/core';
import {IMovie} from "../models/movie";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  // template: '<input #myInput type="button" value="Click me">'
})


export class AdminComponent {
  rowArray = 1
  colArray = 1
  seat_rows: number[] = [this.rowArray]
  seat_columns: number[] = [this.colArray]

  // @ViewChild('rowsInput') sr: number = 0
  // @ViewChild('columnsInput') sc: ElementRef
  @Input() movies: IMovie;
  @ViewChild('cinemaSeats') cinemaSeats: ElementRef;

  constructor(private elementRef: ElementRef, private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
  }


  ngAfterViewInit(rows: string, columns: string) {

    // this.rowArray = 0;
    // this.colArray = 0;

    // public ngAfterViewInit(rows: string, columns: string) {
    // }
  }

  onCreateClick(rows: string, columns: string) {
    this.rowArray = Number(rows);
    this.colArray = Number(columns);
    // this.sr.nativeElement.addEventListener('click', () => {
    //   console.log('Button clicked');
    // });

    console.log(this.seat_rows, " ", this.seat_columns);
    console.log(parseInt(rows) + " ", parseInt(columns));
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
    const factory = this.componentFactoryResolver.resolveComponentFactory(AdminComponent);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    // console.log(this.seat_rows, " ", this.seat_columns)
    // console.log(this.rowArray, " ", this.colArray)
  }

  Number(value: string) {
    return parseInt(value);
  }

  onSeatClick(event: MouseEvent) {
    console.log('Seat clicked');
    console.log('event element', event);
    if ((event.target as HTMLElement).tagName === 'A') {
      let target = event.target as HTMLElement;
      alert(target.innerHTML)
    }
    // Perform any desired action
  }
}


