import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import he from 'he';

import { PostPage } from '../post/post';

@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html'
})
export class CategoryListPage implements OnInit {

  // For getting the news feeds
  loading = false;
  posts = [];
  postCategoryId = '';
  postCategoryName = 'Loading...';
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

  goBack() {
    if (this.navCtrl.canGoBack()) {
      // Only go back one page. Used for posts from categories & search.
      this.navCtrl.pop();
    } else {
      // From home page.
      this.navCtrl.popToRoot();
    }
  }

  getFeed(pageNum: number = 1, reset = false) {
    return this.http.get(`http://news.lchsspartans.net/wp-json/wp/v2/posts?page=${pageNum}&categories=${this.postCategoryId}`, {
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
    return text ? he.decode(String(text).replace(/<[^>]+>/gm, '')).substring(0, 60) + "..." : '';
  }

  ngOnInit() {
    this.getFeed();
  }

  // Categories:
  // http://news.lchsspartans.net/wp-json/wp/v2/categories
  // 121 - Academics
  // 107 - Arts
  // 28 - ASB
  // 108- Choral
  // 30 - Clubs
  // 39 - Featured
  // 34- General
  // 29- News
  // 27- Sports

  constructor(
    public navCtrl: NavController, private http: Http, private navParams: NavParams
  ) {
    this.postCategoryId = this.navParams.get('category_id');
    this.postCategoryName = this.navParams.get('category_name');
  }

}
