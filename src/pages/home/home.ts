import { Component, OnInit, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, PopoverController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import he from 'he';

import { PostPage } from '../post/post';
import { SearchPage } from '../search/search';
import { ListPage } from '../list/list';

import { FeedService } from '../../_services/feed.service';

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
    this.postService.getFeed(this.nextPageCount).then(() => {
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
    this.postService.getFeed(pageNum, reset).then((data) => {
      console.log(data);
      this.posts = data;
    });
  }

  doRefresh(refresher) {
    this.postService.getFeed(1, true).then(() => {
      this.isShowingEnd = false;
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
    private popoverCtrl: PopoverController,
    private postService: FeedService
  ) { }

}
