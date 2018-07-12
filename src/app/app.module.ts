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
import { HotkeyModule } from 'angular2-hotkeys';
import { AnnotationsProvider } from '../providers/annotations/annotations';
import {InplaceInputComponent} from "../components/inplace-input/inplace-input";
import {AnnotatorComponent} from "../components/annotator/annotator";
import {ObjectInputComponent} from "../components/object-input/object-input";

@NgModule({
    declarations: [
        MyApp,
        ItemsPage,
        ItemPage,
        PlaceholderPage,
        CanvasEditorDirective,
        HotkeysPage,
        InplaceInputComponent,
        ObjectInputComponent,
        AnnotatorComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HotkeyModule.forRoot()
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
