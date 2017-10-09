import { Component, OnInit, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, PopoverController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import he from 'he';

import { PostPage } from '../post/post';
import { SearchPage } from '../search/search';
import { ListPage } from '../list/list';

@Injectable()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  // For getting the news feeds
  loading = false;
  posts = [];
  nextPageCount = 1;
  isShowingEnd = false;

  onSwipe(infiniteScroll) {
    this.getFeed(this.nextPageCount).then(() => {
      infiniteScroll.complete();
    }).catch((err) => {
      if (err.json().code === 'rest_post_invalid_page_number') {
        this.isShowingEnd = true;
        infiniteScroll.complete();
      }
    });
  }

  showCategories($event) {
    this.popoverCtrl.create(ListPage).present({
      ev: $event
    });
  }

  goSearch() {
    this.navCtrl.push(SearchPage);
  }

  goToHome() {
    this.navCtrl.pop();
  }

  // TODO: MOVE TO A SERVICE!
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
        this.nextPageCount = 1;
      }

      newData.forEach(element => {
        this.posts.push(element);
      });

      this.nextPageCount++;

    });
  }

  doRefresh(refresher) {
    this.getFeed(1, true).then(() => {
      refresher.complete();
    });
  }

  goToPost(link: string) {
    this.navCtrl.push(PostPage, {
      link: link
    });
  }

  removeHTML(text: string) {
    return text ? he.decode(String(text).replace(/<[^>]+>/gm, '')).substring(0, 60) + "..." : '';
  }

  ngOnInit() {
    this.getFeed();
  }

  constructor(
    public navCtrl: NavController, private http: Http,
    private popoverCtrl: PopoverController
  ) { }

}
