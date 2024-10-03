import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from '../routes/app-routing.module';
import { AppComponent } from '../app/marvel.component';
import { MarvelService } from '../service/marvel.service';
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [MarvelService],
  bootstrap: [AppComponent]
})
export class MarvelModule { }
