import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { fetch } from './data/fetch.ts';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  async fetch() {
    const keys = _.keys(fetch.src);
    const z = _.get(fetch, 'size');
    let b = [];
    for (let i = 0; i < _.size(keys); i++) {
      const key = keys[i];
      const it = _.get(fetch.src, [key]);
      const itkeys = _.keys(it);
      for (let j = 0; j < _.size(itkeys); j++) {
        // c98
        const itkey = itkeys[j];
        const ids = _.get(it, [itkey, 'id']);
        const y = _.get(it, [itkey, 'url']);
        const x = _.get(it, [itkey, 'res']);
        for (let k = 0; k < _.size(ids); k++) {
          const id = ids[k];
          let body = { page: k, size: z, locale: 'vn', id };
          if (!_.isEmpty(id)) {
            let a = await this.http.post(y, body).toPromise();
            console.log(_.get(a, 'data.data'));
            b = _.concat(
              b,
              _.map(_.get(a, 'data.data'), (i: any = {}) => {
                let c = '';
                if (i.createdAt != null && i.createdAt != undefined) {
                  const a = new Date(i.createdAt);
                  const month = a.getMonth() + 1;
                  c = a.getDate() + '-' + month + '-' + a.getFullYear();
                }
                return {
                  url: x + _.get(i, 'slug'),
                  date: c,
                };
              })
            );
          }
        }
      }
    }
    b = _.reverse(b);
    // let c = _.join(b, '\n');
    console.log('test', b);
  }

  async fetch2() {
    let id = '618ca9dc6e02d29b6c43ce96';
    let x = 'https://coin98.net/';
    let y = 'https://insights.coin98.services/api/post/menu';
    let z = 24;
    let b = [];
    for (let i = 0; i <= z; i++) {
      let body = { page: i, size: z, locale: 'vn', id };
      let a = await this.http.post(y, body).toPromise();
      b = _.concat(
        b,
        _.map(_.get(a, 'data.data'), (i: any = {}) => {
          return x + _.get(i, 'slug');
        })
      );
    }
    b = _.reverse(b);
    let c = _.join(b, '\n');
    console.log('test', c);
  }

  async test() {}
}
