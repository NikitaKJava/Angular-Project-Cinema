import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  errorMessage: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // get the error message from the route data
    // @ts-ignore
    this.errorMessage = this.router.getCurrentNavigation().extras.state ? this.router.getCurrentNavigation().extras.state.errorMessage
      : '';
  }
}
