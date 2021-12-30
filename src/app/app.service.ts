import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { fetch } from './data/fetch.ts';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  async fetch(process: any) {
    const keys = _.keys(fetch.src);
    const z = _.get(fetch, 'size');
    const s = _.get(fetch, 'maxPage');
    let msgs = [];
    let res = {};
    for (let i = 0; i < _.size(keys); i++) {
      const key = keys[i];
      const it = _.get(fetch.src, [key]);
      const itkeys = _.keys(it);
      let b = [];
      for (let j = 0; j < _.size(itkeys); j++) {
        // c98
        const itkey = itkeys[j];
        const ids = _.get(it, [itkey, 'id']);
        const y = _.get(it, [itkey, 'url']);
        const x = _.get(it, [itkey, 'res']);
        for (let k = 0; k < _.size(ids); k++) {
          const id = ids[k];
          if (!_.isEmpty(id)) {
            for (let p = 0; p <= s; p++) {
              let body = { page: p, size: z, locale: 'vn', id };
              let a;
              try {
                a = await this.http.post(y, body).toPromise();
              } catch (e) {
                const msg = `error p = ${p} id = ${id} , k = ${k} ,  itkey = ${itkey} ,  j = ${j} , key = ${key} ,  i = ${i} `;
                console.log(msg);
                msgs.push(msg);
              }

              const ares = _.get(a, 'data.data');
              if (_.size(ares) == 0) {
                const msg = `NO DATA p = ${p} id = ${id} , k = ${k} ,  itkey = ${itkey} ,  j = ${j} , key = ${key} ,  i = ${i} `;
                console.log(msg);
                msgs.push(msg);
                if (p > 3) {
                  break;
                }
              }
              if (!_.isEmpty(ares)) {
                const msg = `HAVE DATA p = ${p} id = ${id} , k = ${k} ,  itkey = ${itkey} ,  j = ${j} , key = ${key} ,  i = ${i} `;
                console.log(msg, ares);
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
                      createdAt: i.createdAt,
                    };
                  })
                );
              }
            }
          }
        }
      }
      res[key] = JSON.stringify(b);

      process.text = `${i + 1}/${_.size(keys)}`;
    }

    // let c = _.join(b, '\n');
    console.log('res', res);
    console.log('msgs', msgs);
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
