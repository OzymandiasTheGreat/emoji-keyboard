import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MzTabModule } from "ngx-materialize";

import { SharedPipesModule } from "./pipes/pipes.module";

import { HomeModule } from './home/home.module';
import { EmojiTabsComponent } from "./components/tabs/tabs.component";
import { EmojiPaletteComponent } from "./components/palette/emoji-palette.component";
import { EmojiComponent } from "./components/emoji/emoji.component";

import { AppComponent } from './app.component';
import { from } from 'rxjs';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		EmojiTabsComponent,
		EmojiPaletteComponent,
		EmojiComponent,
	],
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
				deps: [ HttpClient ]
			}
		}),
		BrowserAnimationsModule,
		MzTabModule,
		SharedPipesModule,
	],
	providers: [],
	bootstrap: [ AppComponent ],
})
export class AppModule {}
