import { Component } from '@angular/core';
import { data } from './data/data.ts';
import * as _ from 'lodash';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tabs: any;
  id: any;
  its: any;
  constructor() {
    console.log('data', data);
    this.tabs = _.keys(data);
  }

  click(id) {
    this.id = id;
    this.its = _.get(data, [id, 'main']) || [];
  }
}
