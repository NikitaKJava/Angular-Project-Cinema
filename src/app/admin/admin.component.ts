import {Component, Input} from '@angular/core';
import {IMovie} from "../models/movie";
import { AfterViewInit, ElementRef} from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent {

  seat_rows: number | null | undefined;
  seat_columns: number;

  @Input() movies: IMovie;
  private myInput: any;

  constructor(private elementRef:ElementRef) {}


  ngAfterViewInit() {
    this.myInput.nativeElement.addEventListener('click', () => {
      console.log('Button clicked');
    });
  }
}
