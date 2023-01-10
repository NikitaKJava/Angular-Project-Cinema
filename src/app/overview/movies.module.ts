import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OverviewComponent } from './overview.component';
import { ShowComponent } from '../show/show.component';

import { MoviesRoutingModule } from './movies-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MoviesRoutingModule
  ],
  declarations: [
    // OverviewComponent,
    ShowComponent
  ]
})
export class MoviesModule {}
