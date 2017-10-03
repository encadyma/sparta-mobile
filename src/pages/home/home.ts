import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

import { PostPage } from '../post/post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  // For getting the news feeds
  loading = false;
  posts = [];

  getFeed() {
    return this.http.get(`http://news.lchsspartans.net/wp-json/wp/v2/posts`, {
      withCredentials: false
    }).toPromise().then((data) => {
      this.posts = data.json();

      this.posts.map((item) => {
        this.http.get(item._links['wp:featuredmedia'][0].href, {
          withCredentials: false
        }).toPromise().then((media) => {
          let newItem = item;
          if (typeof media.json().media_details.sizes !== 'undefined' && typeof media.json().media_details.sizes.large !== 'undefined') {
            newItem.featuredImageURL = media.json().media_details.sizes.large.source_url;
          } else if (typeof media.json().source_url !== 'undefined') {
            newItem.featuredImageURL = media.json().source_url;
          }
          return newItem;
        });
      });

    });
  }

  doRefresh(refresher) {
    this.getFeed().then(() => {
      refresher.complete();
    });
  }

  goToPost(link: string) {
    this.navCtrl.push(PostPage, {
      link: link
    });
  }

  removeHTML(text: string) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  ngOnInit() {
    this.getFeed();
  }

  constructor(
    public navCtrl: NavController, private http: Http
  ) { }

}
