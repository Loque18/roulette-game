import { Injectable } from '@angular/core';
import { PagesModule } from 'src/app/pages/pages.module';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private _number = 0;

  get number(): Readonly<number> {
    return this._number;
  }

  constructor() {}

  increase() {
    this._number++;
  }
}
