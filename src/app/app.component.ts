import { Component } from '@angular/core';
import { data } from './data/data.ts';
import * as _ from 'lodash';
import { AppService } from './app.service.ts';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService],
})
export class AppComponent {
  tabs: any;
  id: any;
  its: any;
  status: any; // 0: ẩn, 1 loading, 2 success
  process: any = {
    text: '',
  };
  constructor(private appService: AppService) {
    console.log('data', data);
    this.tabs = _.keys(data);
  }

  click(id) {
    this.id = id;
    this.its = _.get(data, [id, 'main']) || [];
  }

  fetch() {
    this.status = 1;
    this.appService.fetch(this.process).then(() => {
      this.status = 2;
      setTimeout(() => {
        this.status = 0;
      }, 1000);
    });
  }

  fetchNewsMessariOfficial() {
    this.status = 1;
    this.appService.fetchNewsMessariOfficial(this.process).then(() => {
      this.status = 2;
      setTimeout(() => {
        this.status = 0;
      }, 1000);
    });
  }

  getStatus() {
    if (this.status == 0) return '';
    if (this.status == 1) return 'Loading ' + this.process.text;
    if (this.status == 2) {
      this.process.text = '';
      return 'OK';
    }
  }

  isActive(it) {
    return this.id == it;
  }
}
