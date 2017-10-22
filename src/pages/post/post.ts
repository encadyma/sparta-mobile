import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import 'rxjs/add/operator/toPromise';
import he from 'he';
import { ImagesService } from '../../_services/images.service';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage implements OnInit {

  // For getting the news feeds
  loading = false;
  public post;
  postLink = '';

  getPost() {
    this.imgService.close();
    this.http.get(this.postLink, {
      withCredentials: false
    }).toPromise().then((data) => {
      this.post = data.json();

      this.http.get(this.post._links['wp:featuredmedia'][0].href, {
        withCredentials: false
      }).toPromise().then((media) => {
        if (typeof media.json().media_details.sizes !== 'undefined' && typeof media.json().media_details.sizes.large !== 'undefined') {
          this.post.featuredImageURL = media.json().media_details.sizes.large.source_url;
        } else if (typeof media.json().source_url !== 'undefined') {
          this.post.featuredImageURL = media.json().source_url;
        }
      });

    });
  }

  attachImgs(htmlPost: string) {
    let parser = new DOMParser();
    let body = parser.parseFromString("<article>" + htmlPost + "</article>", "text/html");

    if (body.getElementsByTagName("img").length) {
      for (let elem in body.getElementsByTagName("img")) {

        if (body.getElementsByTagName("img")[elem].parentNode) {
          (body.getElementsByTagName("img")[elem].parentNode as any).removeAttribute("href");
        }

      }
    }

    return body.getElementsByTagName("article")[0].innerHTML;
  }

  processClick($event) {
    $event.preventDefault();
    if ($event.target && $event.target.nodeName === 'IMG') {
      this.imgService.open($event.target.getAttribute('src'));
    }
  }

  removeHTML(text: string) {
    let parser = new DOMParser();
    text = "<article>" + text + "</article>"
    let body = parser.parseFromString(text, "text/html");

    if (body.getElementsByTagName("style").length) {
      for (let elem in body.getElementsByTagName("style")) {
        if (body.getElementsByTagName("style")[elem].parentNode) {
          body.getElementsByTagName("style")[elem].parentNode.removeChild(body.getElementsByTagName("style")[elem]);
        }
      }
    }
    if (body.getElementsByTagName("img").length) {
      for (let elem in body.getElementsByTagName("img")) {
        if (typeof body.getElementsByTagName("img")[elem].removeAttribute === 'function') {
          body.getElementsByTagName("img")[elem].removeAttribute('height');
          //body.getElementsByTagName("img")[elem].removeAttribute('width');
        }
      }
    }

    return body.getElementsByTagName("article")[0].innerHTML;
  }

  ngOnInit() {
    this.getPost();
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

  share() {
    this.socialSharing.share(
      `From Sparta: "${this.removeHTML(this.post.title.rendered)}"`,
      `From Sparta: "${this.removeHTML(this.post.title.rendered)}"`,
      this.post.featuredImageURL,
      this.post.link
    );
  }

  constructor(
    private http: Http,
    private navParams: NavParams,
    private navCtrl: NavController,
    private socialSharing: SocialSharing,
    public imgService: ImagesService
  ) {
    this.postLink = this.navParams.get('link');
  }

}
