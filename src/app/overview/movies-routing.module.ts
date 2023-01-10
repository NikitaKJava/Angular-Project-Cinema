import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './overview.component'; // list of movies
import {ShowComponent} from "../show/show.component"; // detail view

const moviesRoutes: Routes = [
  { path: 'movies', redirectTo: '/movies' },
  { path: 'movie/:id', redirectTo: '/movie/:id' },
  { path: 'overview',  component: OverviewComponent },
  { path: 'show/:id', component: ShowComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(moviesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MoviesRoutingModule { }
