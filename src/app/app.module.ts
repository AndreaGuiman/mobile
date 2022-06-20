import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoryService } from './service/category/category.service';
import { ProductService } from './service/product/product.service';
import { ClientService } from './service/client/client.service';
import { CommonModule } from '@angular/common';
import { ClientsPage } from './pages/clients/clients.page';
import { TabsPage } from './pages/tabs/tabs.page';;
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';


@NgModule({
  declarations: [
    AppComponent,
    ClientsPage
  ],
  entryComponents: [

  ],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CategoryService,
    ProductService,
    ClientService,
    InAppBrowser,
    Camera,
    FilePath,
    File,
    WebView
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
