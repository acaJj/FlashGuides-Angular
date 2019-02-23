import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SearchComponent } from './search/search.component';
import { GuideViewerComponent } from './guide-viewer/guide-viewer.component';
import { TextBlockComponent } from './text-block/text-block.component';
import { DataBlockDirective } from './data-block.directive';
import { PictureBlockComponent } from './picture-block/picture-block.component';

@NgModule({
  entryComponents: [
    TextBlockComponent,
    PictureBlockComponent
  ],
  declarations: [
    AppComponent,
    SearchComponent,
    GuideViewerComponent,
    TextBlockComponent,
    DataBlockDirective,
    PictureBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
