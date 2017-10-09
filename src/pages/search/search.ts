import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { PostPage } from '../post/post';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage implements OnInit {

  posts: Observable<any[]>;
  queries = new Subject<string>();
  query = "";
  nextPageCount = 1;
  containsNoResults = false;

  inputToSearch($event) {
    // this.getPosts();
    this.containsNoResults = false;
    this.queries.next($event.target.value);
  }

  goBack() {
    this.navCtrl.popToRoot();
  }

  getPosts(term: string, pageCount = 1) {
    this.containsNoResults = false;
    if (!term.trim()) {
      this.containsNoResults = false;
      return Observable.of([]);
    } else {
      return this.http.get(`http://news.lchsspartans.net/wp-json/wp/v2/posts?search=${term.trim()}&page=${pageCount}&orderby=relevance`, {
        withCredentials: false
      }).map((response) => {
        let posts = response.json();
        let searchingRegex = new RegExp('(' + term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'gi');

        posts.forEach(post => {
          post.title.rendered = post.title.rendered.replace(searchingRegex, '<span class="search-highlighted">$1</span>');
          post.excerpt.rendered = post.excerpt.rendered.replace(searchingRegex, '<span class="search-highlighted">$1</span>');
        });

        this.containsNoResults = (response.json().length ? false : true);
        return posts;
      });
    }
  }

  goToPost(link: string) {
    this.navCtrl.push(PostPage, {
      link: link
    });
  }

  constructor(private navCtrl: NavController, private http: Http) { }

  ngOnInit() {
    this.posts = this.queries
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => (term ? this.getPosts(term) : Observable.of([])))
      .catch(err => {
        console.log(err);
        return Observable.of([]);
      });
  }
}
