import { Component, Injectable, ViewChild } from '@angular/core';
import { Platform, NavController, Tabs } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { ListPage } from '../pages/list/list';

import { ONESIGNAL_KEY_ID, FIREBASE_KEY_ID } from './secret';

@Component({
  templateUrl: 'app.html'
})
@Injectable()
export class MyApp {

  rootPage: any = HomePage;
  searchPage: any = SearchPage;
  listPage: any = ListPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, oneSignal: OneSignal) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Initialize OneSignal
      if (platform.is('cordova')) {
        oneSignal.startInit(ONESIGNAL_KEY_ID, FIREBASE_KEY_ID);
        oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);

        // Event listeners
        oneSignal.handleNotificationReceived().subscribe(() => {
          // Notification recieved
        });

        oneSignal.handleNotificationOpened().subscribe(() => {
          // Notification opened
        });

        oneSignal.endInit();
      }
    });
  }
}
