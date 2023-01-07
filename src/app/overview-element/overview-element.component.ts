import {Component, Input} from '@angular/core';
import {IOverview} from "../models/movie";
import {ShowComponent} from "../show/show.component";

@Component({
  selector: 'app-overview-element',
  templateUrl: './overview-element.component.html',
  styleUrls: ['./overview-element.component.css']
})
export class OverviewElementComponent {
  @Input() overview: IOverview;
}
