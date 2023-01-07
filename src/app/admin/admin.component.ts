import {Component, Input} from '@angular/core';
import {IMovie} from "../models/movie";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent {
  @Input() movies: IMovie;
}
