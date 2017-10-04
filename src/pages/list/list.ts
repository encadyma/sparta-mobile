import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryListPage } from '../category-list/category-list';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  goToCategory(id: number, name: string) {
    this.navCtrl.push(CategoryListPage, {
      category_id: id,
      category_name: name
    });
  }

  ngOnInit() { }

}
