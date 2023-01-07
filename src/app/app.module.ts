import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr' // local time format

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowComponent } from './show/show.component';
import { OverviewComponent } from './overview/overview.component';
import { NavComponent } from './nav/nav.component';
import { ContainerComponent } from './container/container.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AdminComponent } from './admin/admin.component';
import { OverviewElementComponent } from './overview-element/overview-element.component';
import {HttpClientModule} from "@angular/common/http";
import { ProductComponent } from './product/product.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import {FormsModule} from "@angular/forms";

registerLocaleData(localeFr, 'at')

@NgModule({
  declarations: [
    AppComponent,
    ShowComponent,
    OverviewComponent,
    NavComponent,
    ContainerComponent,
    HeaderComponent,
    HomeComponent,
    ContactComponent,
    AdminComponent,
    OverviewElementComponent,
    ProductComponent,
    LoginComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
