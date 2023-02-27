import { Component } from '@angular/core';
import { CounterService } from './shared/services/counter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lazy';

  constructor(private counterService: CounterService) {}

  increase(): void {
    this.counterService.increase();
  }
}
