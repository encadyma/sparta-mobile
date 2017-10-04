import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Tabs } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('tabNav') tabCtrl: Tabs;
  @ViewChild('tabHome') tabHome: NavController;
  @ViewChild('tabList') tabList: NavController;

  rootPage: any = HomePage;
  searchPage: any = SearchPage;
  listPage: any = ListPage;

  goToHome() {
    this.tabHome.popToRoot();
    this.tabCtrl.select(0);
  }

  goToList() {
    this.tabList.popToRoot();
    this.tabCtrl.select(1);
  }

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
