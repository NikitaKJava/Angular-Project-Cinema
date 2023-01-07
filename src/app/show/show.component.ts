import { Component, Input, OnInit } from '@angular/core';
import {IMovie, IOverview} from "../models/movie";
import {ActivatedRoute} from "@angular/router"; // import interface
import {ShowsComponent} from "../database/movies";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  @Input() movie: IMovie;// tconfig.json
  @Input() shows:IOverview

  cardDate: Date = new Date();

  show: { id: number; showImg: string; showStatus: string; showPEGI: string; showScreen: string; showSound: string; } | undefined;
  showId: string | number | null;

  constructor(private activatedRoute: ActivatedRoute, private service: ShowsComponent) { // for correct id
  }


  ngOnInit(): void {
    // this.showId = this.activatedRoute.snapshot.paramMap.get('id');
    this.showId = this.activatedRoute.snapshot.params['id'];
    this.show = this.service.shows.find(x => x.id == this.showId);
  }
}
