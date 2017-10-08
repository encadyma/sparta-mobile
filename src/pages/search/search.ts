import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage implements OnInit {

  posts = [];

  inputToSearch($event) {
    console.log($event);
  }

  constructor() { }

  ngOnInit() { }
}
