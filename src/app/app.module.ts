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
import { HotkeyProvider } from '../providers/hotkeys/hotkeys';
import { HotkeysPage } from '../pages/hotkeys/hotkeys';
import { HotkeyModule } from 'angular2-hotkeys';
import { AnnotationsProvider } from '../providers/annotations/annotations';
import {AnnotatorComponent} from "../components/annotator/annotator";
import {ObjectInputComponent} from "../components/object-input/object-input";
import {ActionInputComponent} from "../components/action-input/action-input";
import {SettingsPage} from "../pages/settings/settings";
import { ImageSizeSettingProvider } from '../providers/image-size-setting/image-size-setting';
import {ImageSizePage} from "../pages/image-size/image-size";
import {HelpPage} from "../pages/help/help";
import {AutoLabelPage} from "../pages/auto-label/auto-label";
import {GenericInputComponent} from "../components/generic-input/generic-input";

@NgModule({
    declarations: [
        MyApp,
        ItemsPage,
        ItemPage,
        PlaceholderPage,
        HelpPage,
        HotkeysPage,
        SettingsPage,
        ImageSizePage,
        AutoLabelPage,
        ObjectInputComponent,
        AnnotatorComponent,
        ActionInputComponent,
        GenericInputComponent
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
        HotkeysPage,
        HelpPage,
        AutoLabelPage,
        SettingsPage,
        ImageSizePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        FileProvider,
        NavProxyService,
        ImageProvider,
        HotkeyProvider,
        AnnotationsProvider,
        ImageSizeSettingProvider
    ]
})
export class AppModule {
}
