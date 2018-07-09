import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {FileProvider} from '../providers/file/file';
import {NavProxyService} from '../providers/nav-proxy/nav-proxy';
import {ItemsPage} from "../pages/items/items";
import {ItemPage} from "../pages/item/item";
import {PlaceholderPage} from "../pages/placeholder/placeholder";
import {ImageProvider} from '../providers/image/image';
import {CanvasEditorDirective} from "../directives/canvas-editor/canvas-editor";
import { HotkeyProvider } from '../providers/hotkeys/hotkeys';
import { HotkeysPage } from '../pages/hotkeys/hotkeys';
import { AnnotationsProvider } from '../providers/annotations/annotations';

@NgModule({
    declarations: [
        MyApp,
        ItemsPage,
        ItemPage,
        PlaceholderPage,
        CanvasEditorDirective,
        HotkeysPage
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
        PlaceholderPage,
        HotkeysPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        FileProvider,
        NavProxyService,
        ImageProvider,
        HotkeyProvider,
        AnnotationsProvider
    ]
})
export class AppModule {
}
