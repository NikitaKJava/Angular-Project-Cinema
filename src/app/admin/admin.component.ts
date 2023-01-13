import {Component, Input} from '@angular/core';
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

  @Input() seat_rows: number
  @Input() seat_columns: number
  @ViewChild('rowsInput') sr: number = 0
  @ViewChild('columnsInput') sc: ElementRef
  @Input() movies: IMovie;

  constructor(private elementRef:ElementRef) {}


  ngAfterViewInit(rows: number, columns: number) {

    // this.seat_rows = rows;
    // this.seat_columns = columns;
    // this.sr.nativeElement.addEventListener('click', () => {
    //   console.log('Button clicked');
    // });
    console.log(this.seat_rows, " ", this.seat_columns)
  }

  Number(number1: string, number2: string) {
    this.seat_rows = Number.parseInt(number1);
    this.seat_columns = Number.parseInt(number2);
  }
}
