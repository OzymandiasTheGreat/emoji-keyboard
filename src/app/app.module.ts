<<<<<<< HEAD
import "zone.js/dist/zone-mix";
import "reflect-metadata";
import "../polyfills";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { A11yModule } from "@angular/cdk/a11y";

import { HttpClientModule, HttpClient } from "@angular/common/http";
=======
import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
>>>>>>> a304034e08123b1a8179d7125a5cbe0743dbcf75

import { AppRoutingModule } from "./app-routing.module";

// NG Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

<<<<<<< HEAD
import { ElectronService } from "./providers/electron.service";
import { DataService } from "./providers/data.service";

import { WebviewDirective } from "./directives/webview.directive";

import { MzTabModule} from "ngx-materialize";

import { SharedPipesModule } from "./pipes/pipes.module";
import { AppComponent } from "./app.component";
import { TabbarComponent } from "./components/category-tabs/tabbar.component";
import { PaletteComponent } from "./components/shared/palette/palette.component";
import { EmojiComponent } from "./components/shared/emoji/emoji.component";
import { SearchComponent } from "./components/search/search.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [
		AppComponent,
		TabbarComponent,
		PaletteComponent,
		EmojiComponent,
		SearchComponent,
		WebviewDirective,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		A11yModule,
		AppRoutingModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (HttpLoaderFactory),
				deps: [HttpClient],
			},
		}),
		MzTabModule,
		SharedPipesModule,
	],
	providers: [
		ElectronService,
		DataService,
	],
	bootstrap: [AppComponent]
=======
import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
>>>>>>> a304034e08123b1a8179d7125a5cbe0743dbcf75
})
export class AppModule {}
