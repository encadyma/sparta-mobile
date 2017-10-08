import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage implements OnInit {

  posts = [];
  query = "";

  inputToSearch($event) {
    console.log($event);
  }

  goBack() {
    this.navCtrl.popToRoot();
  }

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }
}
