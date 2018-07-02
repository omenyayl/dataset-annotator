import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { FileProvider } from '../providers/file/file';
import { NavProxyService } from '../providers/nav-proxy/nav-proxy';
import {ItemsPage} from "../pages/items/items";
import {ItemPage} from "../pages/item/item";
import {PlaceholderPage} from "../pages/placeholder/placeholder";

@NgModule({
  declarations: [
    MyApp,
    ItemsPage,
    ItemPage,
    PlaceholderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ItemsPage,
    ItemPage,
    PlaceholderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileProvider,
    NavProxyService
  ]
})
export class AppModule {}
