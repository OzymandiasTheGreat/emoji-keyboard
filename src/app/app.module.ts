import "zone.js/dist/zone-mix";
import "reflect-metadata";
import "../polyfills";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { A11yModule } from "@angular/cdk/a11y";

import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";

// NG Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

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
})
export class AppModule { }
