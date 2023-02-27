import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { TestComponent } from './test/test.component';

import { CounterService } from '../shared/services/counter.service';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ],
  providers: [
    CounterService
  ]
})
export class PagesModule { }
