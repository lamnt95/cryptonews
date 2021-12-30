import { Component } from '@angular/core';
import { data } from './data/data.ts';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';
  constructor() {
    console.log('data', data);
  }
}
