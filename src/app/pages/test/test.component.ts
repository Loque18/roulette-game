import { Component } from '@angular/core';
import { CounterService } from 'src/app/shared/services/counter.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  constructor(protected counterService: CounterService) {}

  increase() {
    this.counterService.increase();
  }
}
