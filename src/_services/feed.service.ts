import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class FeedService {

  posts = [];

  getFeed(pageNum: number = 1, reset = false) {
    return this.http.get(`http://news.lchsspartans.net/wp-json/wp/v2/posts?page=${pageNum}`, {
      withCredentials: false
    }).toPromise().then((data) => {
      let newData = data.json();

      newData.map((item) => {
        if (item._links['wp:featuredmedia']) {
          this.http.get(item._links['wp:featuredmedia'][0].href, {
            withCredentials: false
          }).toPromise().then((media) => {
            let newItem = item;
            if (typeof media.json().media_details.sizes !== 'undefined' && typeof media.json().media_details.sizes.large !== 'undefined') {
              newItem.featuredImageURL = media.json().media_details.sizes.large.source_url;
            } else if (typeof media.json().source_url !== 'undefined') {
              newItem.featuredImageURL = media.json().source_url;
            } else {
              newItem.featuredImageURL = 'assets/NoImage.png';
            }
            return newItem;
          }).catch((err) => {
            let newItem = item;
            newItem.featuredImageURL = 'assets/NoImage.png';
            return newItem;
          });
        } else {
          let newItem = item;
          newItem.featuredImageURL = 'assets/NoImage.png';
          return newItem;
        }
      });

      if (reset) {
        this.posts = [];
      }

      newData.forEach(element => {
        this.posts.push(element);
      });

      return this.posts;

    });
  }

  constructor(private http: Http) { }
}
