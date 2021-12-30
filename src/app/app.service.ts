import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { fetch } from './data/fetch.ts';
import { fetchOfficialNewMessari } from './data/fetchMessariNews.ts';

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

  async fetchNewsMessariOfficial(process: any) {
    const url = _.get(fetchOfficialNewMessari, 'url');
    const body = _.get(fetchOfficialNewMessari, 'body') || {};
    const body2 = { ...body };

    let totalCount = 1000;
    let startCursor = '0';
    let data = [];
    let endCursor = '0';
    let i = 1;

    _.set(body2, 'variables.after', startCursor);

    while (_.toNumber(endCursor) < _.toNumber(totalCount) && i < 10) {
      let a;
      try {
        a = await this.http.post(url, body2).toPromise();
        const msg = `SUCCESS i=${i} start=${startCursor} tol=${totalCount} `;
        console.log(msg);
      } catch (e) {
        const msg = `ERROR i=${i} start=${startCursor} tol=${totalCount} `;
        console.log(msg);
        console.log(e);
      }

      totalCount = _.get(a, 'data.aggregatedContents.totalCount');
      endCursor = _.get(a, 'data.aggregatedContents.pageInfo.endCursor');
      const data2 = _.get(a, 'data.aggregatedContents.edges');
      if (endCursor != null && endCursor != undefined) {
        startCursor = endCursor;
        _.set(body2, 'variables.after', endCursor);
      }
      if (_.size(data2) > 0) {
        const data3 = _.map(data2, (it: any = {}) => {
          const url = _.get(it, 'node.link');
          const createdAt = _.get(it, 'node.publishDate');
          const a = new Date(createdAt);
          const month = a.getMonth() + 1;
          const date = a.getDate() + '-' + month + '-' + a.getFullYear();
          return {
            url,
            date,
            createdAt,
          };
        });
        data = _.concat(data, data3);
      }
      i++;
      const pct = _.round((_.toNumber(startCursor) / totalCount) * 100);
      process.text = `${pct}/100`;
    }
    console.log('res', data);
  }
}
